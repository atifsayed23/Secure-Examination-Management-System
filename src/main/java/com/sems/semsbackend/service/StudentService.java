package com.sems.semsbackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sems.semsbackend.entity.Student;
import com.sems.semsbackend.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Save student
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Delete student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}