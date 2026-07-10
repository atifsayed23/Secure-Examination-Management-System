package com.sems.semsbackend.controller;

import com.sems.semsbackend.dto.AttendanceRequest;
import com.sems.semsbackend.entity.Attendance;
import com.sems.semsbackend.service.AttendanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public Optional<Attendance> getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public Attendance createAttendance(@RequestBody AttendanceRequest request) {
        return attendanceService.createAttendance(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY')")
    public Attendance updateAttendance(@PathVariable Long id, @RequestBody AttendanceRequest request) {
        return attendanceService.updateAttendance(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
    }
}
