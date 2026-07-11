package com.sems.semsbackend.controller;

import com.sems.semsbackend.entity.QuestionPaperAuditLog;
import com.sems.semsbackend.dto.AuditLogDTO;
import com.sems.semsbackend.repository.QuestionPaperAuditLogRepository;
import com.sems.semsbackend.service.QuestionPaperService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/question-papers")
public class QuestionPaperController {

    private final QuestionPaperService questionPaperService;
    private final QuestionPaperAuditLogRepository auditLogRepository;

    public QuestionPaperController(QuestionPaperService questionPaperService,
                                   QuestionPaperAuditLogRepository auditLogRepository) {
        this.questionPaperService = questionPaperService;
        this.auditLogRepository = auditLogRepository;
    }

    @PostMapping("/upload/{examId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_PAPER_SETTER', 'PAPER_SETTER')")
    public ResponseEntity<String> uploadQuestionPaper(@PathVariable Long examId,
                                                      @RequestParam("file") MultipartFile file,
                                                      Authentication authentication) {
        try {
            questionPaperService.uploadQuestionPaper(examId, authentication.getName(), file);
            return ResponseEntity.ok("Question paper uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload question paper: " + e.getMessage());
        }
    }

    /**
     * @param examId
     * @param authentication
     * @return
     */
    @GetMapping("/download/{examId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER')")
    public ResponseEntity<?> downloadQuestionPaper(@PathVariable Long examId, Authentication authentication) {
        try {
            byte[] decryptedFile = questionPaperService.downloadQuestionPaper(examId, authentication.getName());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF); // assuming PDF uploads
            headers.setContentDispositionFormData("attachment", "question_paper_" + examId + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(decryptedFile);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @GetMapping("/{examId}/audit-logs")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER')")
    public ResponseEntity<List<AuditLogDTO>> getAuditLogs(@PathVariable Long examId) {
        List<QuestionPaperAuditLog> logs = auditLogRepository.findByExamIdOrderByTimestampDesc(examId);
        
        List<AuditLogDTO> dtos = logs.stream().map(log -> {
            AuditLogDTO dto = new AuditLogDTO();
            dto.setId(log.getId());
            dto.setExamId(log.getExamId());
            dto.setUserName(log.getUser() != null ? log.getUser().getFullName() : "Unknown");
            dto.setFileName(log.getQuestionPaper() != null ? log.getQuestionPaper().getFileName() : null);
            dto.setAction(log.getAction());
            dto.setStatus(log.getStatus());
            dto.setTimestamp(log.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
}
