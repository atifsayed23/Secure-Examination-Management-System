package com.sems.semsbackend.service;

import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.entity.QuestionPaper;
import com.sems.semsbackend.entity.QuestionPaperAuditLog;
import com.sems.semsbackend.entity.User;
import com.sems.semsbackend.repository.ExamRepository;
import com.sems.semsbackend.repository.QuestionPaperAuditLogRepository;
import com.sems.semsbackend.repository.QuestionPaperRepository;
import com.sems.semsbackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class QuestionPaperService {

    private final QuestionPaperRepository questionPaperRepository;
    private final QuestionPaperAuditLogRepository auditLogRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final NotificationService notificationService;

    public QuestionPaperService(QuestionPaperRepository questionPaperRepository,
                                QuestionPaperAuditLogRepository auditLogRepository,
                                ExamRepository examRepository,
                                UserRepository userRepository,
                                EncryptionService encryptionService,
                                NotificationService notificationService) {
        this.questionPaperRepository = questionPaperRepository;
        this.auditLogRepository = auditLogRepository;
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.notificationService = notificationService;
    }

    public void uploadQuestionPaper(Long examId, String userEmail, MultipartFile file) throws Exception {
        User uploader = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Delete existing paper if any
        questionPaperRepository.findByExamId(examId).ifPresent(questionPaperRepository::delete);

        byte[] encryptedContent = encryptionService.encrypt(file.getBytes());

        QuestionPaper paper = new QuestionPaper();
        paper.setExam(exam);
        paper.setUploader(uploader);
        paper.setFileName(file.getOriginalFilename());
        paper.setEncryptedContent(encryptedContent);

        QuestionPaper savedPaper = questionPaperRepository.save(paper);

        try {
            notificationService.notifyAllAdmins(
                "Question Paper Uploaded",
                "A question paper has been uploaded for exam: " + exam.getExamName(),
                "INFO"
            );
        } catch (Exception e) {}

        logAction(savedPaper, examId, uploader, "UPLOAD", "SUCCESS");
    }

    public byte[] downloadQuestionPaper(Long examId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime examStart = exam.getExamDate().atTime(exam.getStartTime());
        LocalDateTime examEnd = examStart.plusMinutes(exam.getDuration());

        if (now.isBefore(examStart) || now.isAfter(examEnd)) {
            logAction(null, examId, user, "UNAUTHORIZED_ACCESS_ATTEMPT", "DENIED");
            throw new SecurityException("Question paper can only be accessed during the scheduled exam time.");
        }

        QuestionPaper paper = questionPaperRepository.findByExamId(examId)
                .orElseThrow(() -> new RuntimeException("Question paper not found for this exam"));

        try {
            byte[] decryptedContent = encryptionService.decrypt(paper.getEncryptedContent());
            logAction(paper, examId, user, "DOWNLOAD", "SUCCESS");
            return decryptedContent;
        } catch (Exception e) {
            logAction(paper, examId, user, "DOWNLOAD_FAILED", "DENIED");
            throw new RuntimeException("Failed to decrypt the question paper.");
        }
    }

    private void logAction(QuestionPaper paper, Long examId, User user, String action, String status) {
        QuestionPaperAuditLog log = new QuestionPaperAuditLog();
        log.setQuestionPaper(paper);
        log.setExamId(examId);
        log.setUser(user);
        log.setAction(action);
        log.setStatus(status);
        auditLogRepository.save(log);
    }
}
