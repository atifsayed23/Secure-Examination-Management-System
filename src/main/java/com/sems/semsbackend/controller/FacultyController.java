package com.sems.semsbackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sems.semsbackend.entity.Faculty;
import com.sems.semsbackend.service.FacultyService;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    // View all faculties
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public List<Faculty> getAllFaculties() {
        return facultyService.getAllFaculties();
    }

    // View faculty by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public Optional<Faculty> getFacultyById(@PathVariable Long id) {
        return facultyService.getFacultyById(id);
    }

    // Create faculty
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Faculty createFaculty(@RequestBody Faculty faculty) {
        return facultyService.saveFaculty(faculty);
    }

    // Update faculty
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Faculty updateFaculty(@PathVariable Long id, @RequestBody Faculty facultyDetails) {
        return facultyService.getFacultyById(id).map(existingFaculty -> {
            existingFaculty.setEmployeeId(facultyDetails.getEmployeeId());
            existingFaculty.setFullName(facultyDetails.getFullName());
            existingFaculty.setEmail(facultyDetails.getEmail());
            existingFaculty.setPhoneNumber(facultyDetails.getPhoneNumber());
            existingFaculty.setDepartment(facultyDetails.getDepartment());
            existingFaculty.setDesignation(facultyDetails.getDesignation());
            existingFaculty.setStatus(facultyDetails.getStatus());
            return facultyService.saveFaculty(existingFaculty);
        }).orElseThrow(() -> new RuntimeException("Faculty not found with id " + id));
    }

    // Delete faculty
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
    }
}
