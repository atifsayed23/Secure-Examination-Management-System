package com.sems.semsbackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sems.semsbackend.entity.Subject;
import com.sems.semsbackend.repository.SubjectRepository;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // Get all subjects
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Get subject by ID
    public Optional<Subject> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }

    // Create or Update subject
    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    // Delete subject
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }

    // Check if subject code already exists
    public boolean existsBySubjectCode(String subjectCode) {
        return subjectRepository.existsBySubjectCode(subjectCode);
    }
}