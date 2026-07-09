package com.sems.semsbackend.controller;

import com.sems.semsbackend.dto.SeatingArrangementRequest;
import com.sems.semsbackend.entity.SeatingArrangement;
import com.sems.semsbackend.service.SeatingArrangementService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seating")
public class SeatingArrangementController {

    private final SeatingArrangementService seatingArrangementService;

    public SeatingArrangementController(SeatingArrangementService seatingArrangementService) {
        this.seatingArrangementService = seatingArrangementService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public List<SeatingArrangement> getAllArrangements() {
        return seatingArrangementService.getAllArrangements();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public Optional<SeatingArrangement> getArrangementById(@PathVariable Long id) {
        return seatingArrangementService.getArrangementById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public SeatingArrangement createArrangement(@RequestBody SeatingArrangementRequest request) {
        return seatingArrangementService.createSeatingArrangement(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteArrangement(@PathVariable Long id) {
        seatingArrangementService.deleteArrangement(id);
    }
}
