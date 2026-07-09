package com.sems.semsbackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sems.semsbackend.entity.ExamHall;
import com.sems.semsbackend.service.ExamHallService;

@RestController
@RequestMapping("/api/exam-halls")
public class ExamHallController {

    private final ExamHallService examHallService;

    public ExamHallController(ExamHallService examHallService) {
        this.examHallService = examHallService;
    }

    // View all exam halls
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public List<ExamHall> getAllExamHalls() {
        return examHallService.getAllExamHalls();
    }

    // View exam hall by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public Optional<ExamHall> getExamHallById(@PathVariable Long id) {
        return examHallService.getExamHallById(id);
    }

    // Create exam hall
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ExamHall createExamHall(@RequestBody ExamHall examHall) {
        return examHallService.saveExamHall(examHall);
    }

    // Update exam hall
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public ExamHall updateExamHall(@PathVariable Long id, @RequestBody ExamHall examHallDetails) {
        return examHallService.getExamHallById(id).map(existingHall -> {
            existingHall.setHallNumber(examHallDetails.getHallNumber());
            existingHall.setBuilding(examHallDetails.getBuilding());
            existingHall.setFloor(examHallDetails.getFloor());
            existingHall.setCapacity(examHallDetails.getCapacity());
            existingHall.setStatus(examHallDetails.getStatus());
            return examHallService.saveExamHall(existingHall);
        }).orElseThrow(() -> new RuntimeException("Exam Hall not found with id " + id));
    }

    // Delete exam hall
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteExamHall(@PathVariable Long id) {
        examHallService.deleteExamHall(id);
    }
}
