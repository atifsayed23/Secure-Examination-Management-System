package com.sems.semsbackend.controller;

import com.sems.semsbackend.dto.DashboardExamSummaryDTO;
import com.sems.semsbackend.dto.DashboardSummaryDTO;
import com.sems.semsbackend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public ResponseEntity<DashboardSummaryDTO> getGlobalSummary() {
        return ResponseEntity.ok(dashboardService.getGlobalSummary());
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public ResponseEntity<DashboardExamSummaryDTO> getExamSummary(@PathVariable Long examId) {
        return ResponseEntity.ok(dashboardService.getExamSummary(examId));
    }
}
