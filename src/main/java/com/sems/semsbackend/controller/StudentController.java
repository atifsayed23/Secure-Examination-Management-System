package com.sems.semsbackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sems.semsbackend.entity.Student;
import com.sems.semsbackend.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // View all students
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // View student by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'EXAM_CONTROLLER')")
    public Optional<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // Create student
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Student createStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    // Update student
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        return studentService.getStudentById(id).map(existingStudent -> {
            existingStudent.setEnrollmentNumber(studentDetails.getEnrollmentNumber());
            existingStudent.setFullName(studentDetails.getFullName());
            existingStudent.setEmail(studentDetails.getEmail());
            existingStudent.setPhoneNumber(studentDetails.getPhoneNumber());
            existingStudent.setSemester(studentDetails.getSemester());
            existingStudent.setDepartment(studentDetails.getDepartment());
            existingStudent.setStatus(studentDetails.getStatus());
            return studentService.saveStudent(existingStudent);
        }).orElseThrow(() -> new RuntimeException("Student not found with id " + id));
    }

    // Delete student
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}