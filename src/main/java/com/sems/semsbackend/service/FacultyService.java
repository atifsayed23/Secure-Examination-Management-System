package com.sems.semsbackend.service;

import com.sems.semsbackend.entity.Faculty;
import com.sems.semsbackend.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public Faculty saveFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }

    public Optional<Faculty> getFacultyById(Long id) {
        return facultyRepository.findById(id);
    }

    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }
}
