package com.sems.semsbackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.service.ExamService;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    // View all exams
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'PAPER_SETTER', 'MODERATOR', 'EXAM_CENTER_ADMIN')")
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    // View exam by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'PAPER_SETTER', 'MODERATOR', 'EXAM_CENTER_ADMIN')")
    public Optional<Exam> getExamById(@PathVariable Long id) {
        return examService.getExamById(id);
    }

    // Create exam
    @PostMapping
//    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public Exam createExam(@RequestBody Exam exam) {
        return examService.saveExam(exam);
    }

    // Update exam
    @PutMapping("/{id}")
    public Exam updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        exam.setId(id);
        return examService.saveExam(exam);
    }

    // Delete exam
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
    }
}