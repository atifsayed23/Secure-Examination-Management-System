package com.sems.semsbackend.controller;

import com.sems.semsbackend.dto.ResultRequestDTO;
import com.sems.semsbackend.dto.ResultResponseDTO;
import com.sems.semsbackend.dto.UpdateResultRequestDTO;
import com.sems.semsbackend.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FACULTY')")
    public ResponseEntity<ResultResponseDTO> createResult(@Valid @RequestBody ResultRequestDTO request) {
        return new ResponseEntity<>(resultService.createResult(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public ResponseEntity<List<ResultResponseDTO>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public ResponseEntity<ResultResponseDTO> getResultById(@PathVariable Long id) {
        return ResponseEntity.ok(resultService.getResultById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<ResultResponseDTO>> getResultsByStudent(@PathVariable Long studentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean isStudentRole = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));

        return ResponseEntity.ok(resultService.getResultsByStudent(studentId, username, isStudentRole));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ResultResponseDTO>> getMyResults() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return ResponseEntity.ok(resultService.getMyResults(username));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public ResponseEntity<ResultResponseDTO> updateResult(@PathVariable Long id, @Valid @RequestBody UpdateResultRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isFaculty = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_FACULTY"));

        return ResponseEntity.ok(resultService.updateResult(id, request, isFaculty));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/publish/{examId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public ResponseEntity<java.util.Map<String, String>> publishResultsForExam(@PathVariable Long examId) {
        int publishedCount = resultService.publishResultsForExam(examId);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", publishedCount + " result(s) successfully published.");
        return ResponseEntity.ok(response);
    }
}
