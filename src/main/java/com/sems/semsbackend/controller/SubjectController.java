package com.sems.semsbackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.sems.semsbackend.entity.Subject;
import com.sems.semsbackend.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // View all subjects
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_ROLE_SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER')")
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    // View subject by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_ROLE_SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER')")
    public Optional<Subject> getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    // Create subject
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_ROLE_SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER')")
    public Subject createSubject(@Valid @RequestBody Subject subject) {
        return subjectService.saveSubject(subject);
    }

    // Update subject
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_ROLE_SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER')")
    public Subject updateSubject(@PathVariable Long id, @Valid @RequestBody Subject subject) {
        Subject existingSubject = subjectService.getSubjectById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        existingSubject.setSubjectName(subject.getSubjectName());
        existingSubject.setSubjectCode(subject.getSubjectCode());
        existingSubject.setDescription(subject.getDescription());
        existingSubject.setSemester(subject.getSemester());
        existingSubject.setCredits(subject.getCredits());
        existingSubject.setStatus(subject.getStatus());

        return subjectService.saveSubject(existingSubject);
    }

    // Delete subject
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_ROLE_SUPER_ADMIN')")
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}