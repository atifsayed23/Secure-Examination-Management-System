package com.sems.semsbackend.service;

import com.sems.semsbackend.dto.ResultRequestDTO;
import com.sems.semsbackend.dto.ResultResponseDTO;
import com.sems.semsbackend.dto.UpdateResultRequestDTO;
import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.entity.Result;
import com.sems.semsbackend.entity.Student;
import com.sems.semsbackend.exception.ResourceNotFoundException;
import com.sems.semsbackend.repository.ExamRepository;
import com.sems.semsbackend.repository.ResultRepository;
import com.sems.semsbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final NotificationService notificationService;
    private final com.sems.semsbackend.repository.UserRepository userRepository;

    public ResultService(ResultRepository resultRepository,
                         StudentRepository studentRepository,
                         ExamRepository examRepository,
                         NotificationService notificationService,
                         com.sems.semsbackend.repository.UserRepository userRepository) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.examRepository = examRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @Transactional
    public ResultResponseDTO createResult(ResultRequestDTO request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + request.getExamId()));

        // Check if result already exists
        Optional<Result> existingResult = resultRepository.findByStudentIdAndExamId(student.getId(), exam.getId());
        if (existingResult.isPresent()) {
            throw new IllegalArgumentException("Result already exists for this student and exam.");
        }

        if (exam.getTotalMarks() == null || exam.getTotalMarks() <= 0) {
            throw new IllegalArgumentException("Exam total marks must be greater than zero.");
        }

        if (request.getMarksObtained() > exam.getTotalMarks()) {
            throw new IllegalArgumentException("Marks obtained cannot be greater than total marks.");
        }

        Result result = new Result();
        result.setStudent(student);
        result.setExam(exam);
        result.setMarksObtained(request.getMarksObtained());
        result.setTotalMarks(exam.getTotalMarks());

        calculateResultMetrics(result);

        Result savedResult = resultRepository.save(result);
        return mapToDTO(savedResult);
    }

    public List<ResultResponseDTO> getAllResults() {
        return resultRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ResultResponseDTO getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
        return mapToDTO(result);
    }

    public List<ResultResponseDTO> getResultsByStudent(Long studentId, String username, boolean isStudentRole) {
        // Verify student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (isStudentRole && !student.getEmail().equals(username)) {
            throw new IllegalArgumentException("You can only view your own results.");
        }

        List<Result> results;
        if (isStudentRole) {
            results = resultRepository.findByStudentIdAndPublishedTrue(studentId);
        } else {
            results = resultRepository.findByStudentId(studentId);
        }
        return results.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ResultResponseDTO> getMyResults(String email) {
        return resultRepository.findByStudentEmailAndPublishedTrue(email).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResultResponseDTO updateResult(Long id, UpdateResultRequestDTO request, boolean isFaculty) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));

        if (isFaculty && Boolean.TRUE.equals(result.getPublished())) {
            throw new IllegalArgumentException("Faculty cannot update a result after it has been published.");
        }

        if (request.getMarksObtained() > result.getTotalMarks()) {
            throw new IllegalArgumentException("Marks obtained cannot be greater than total marks.");
        }

        result.setMarksObtained(request.getMarksObtained());
        calculateResultMetrics(result);

        Result updatedResult = resultRepository.save(result);
        return mapToDTO(updatedResult);
    }

    @Transactional
    public void deleteResult(Long id) {
        if (!resultRepository.existsById(id)) {
            throw new ResourceNotFoundException("Result not found with id: " + id);
        }
        resultRepository.deleteById(id);
    }

    @Transactional
    public int publishResultsForExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
        
        int publishedCount = resultRepository.publishResultsForExam(examId, LocalDateTime.now());

        if (publishedCount > 0) {
            List<Result> results = resultRepository.findByExamId(examId);
            for (Result r : results) {
                if (Boolean.TRUE.equals(r.getPublished())) {
                    String email = r.getStudent().getEmail();
                    userRepository.findByEmail(email).ifPresent(user -> {
                        try {
                            notificationService.createNotification(user, 
                                "Result Published", 
                                "Your result for exam '" + exam.getExamName() + "' has been published.", 
                                "SUCCESS");
                        } catch (Exception e) {}
                    });
                }
            }
        }
        return publishedCount;
    }

    private void calculateResultMetrics(Result result) {
        double percentage = ((double) result.getMarksObtained() / result.getTotalMarks()) * 100;
        result.setPercentage(percentage);

        if (percentage >= 90) {
            result.setGrade("A+");
        } else if (percentage >= 80) {
            result.setGrade("A");
        } else if (percentage >= 70) {
            result.setGrade("B");
        } else if (percentage >= 60) {
            result.setGrade("C");
        } else if (percentage >= 50) {
            result.setGrade("D");
        } else {
            result.setGrade("F");
        }

        if (percentage >= 50) {
            result.setResultStatus("PASS");
        } else {
            result.setResultStatus("FAIL");
        }
    }

    private ResultResponseDTO mapToDTO(Result result) {
        ResultResponseDTO dto = new ResultResponseDTO();
        dto.setId(result.getId());
        dto.setStudent(result.getStudent().getFullName());
        dto.setExam(result.getExam().getExamName());
        dto.setMarksObtained(result.getMarksObtained());
        dto.setTotalMarks(result.getTotalMarks());
        dto.setPercentage(result.getPercentage());
        dto.setGrade(result.getGrade());
        dto.setResultStatus(result.getResultStatus());
        dto.setPublished(result.getPublished());
        dto.setPublishedAt(result.getPublishedAt());
        return dto;
    }
}
