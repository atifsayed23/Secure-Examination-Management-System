package com.sems.semsbackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.repository.ExamRepository;

@Service
public class ExamService {

    private final ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    // Get all exams
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // Get exam by ID
    public Optional<Exam> getExamById(Long id) {
        return examRepository.findById(id);
    }

    // Create Exam
    public Exam saveExam(Exam exam) {

        if (exam.getId() == null) {
            // New Exam
            exam.setCreatedAt(LocalDateTime.now());
            exam.setUpdatedAt(LocalDateTime.now());
            return examRepository.save(exam);
        }

        // Update Existing Exam
        Exam existingExam = examRepository.findById(exam.getId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        existingExam.setExamName(exam.getExamName());
        existingExam.setExamCode(exam.getExamCode());
        existingExam.setDescription(exam.getDescription());
        existingExam.setExamDate(exam.getExamDate());
        existingExam.setDuration(exam.getDuration());
        existingExam.setTotalMarks(exam.getTotalMarks());
        existingExam.setStatus(exam.getStatus());

        // Preserve createdAt
        existingExam.setUpdatedAt(LocalDateTime.now());

        return examRepository.save(existingExam);
    }

    // Delete Exam
    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    // Check if exam code already exists
    public boolean existsByExamCode(String examCode) {
        return examRepository.existsByExamCode(examCode);
    }
}