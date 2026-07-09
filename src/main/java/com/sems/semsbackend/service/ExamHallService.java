package com.sems.semsbackend.service;

import com.sems.semsbackend.entity.ExamHall;
import com.sems.semsbackend.repository.ExamHallRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamHallService {

    private final ExamHallRepository examHallRepository;

    public ExamHallService(ExamHallRepository examHallRepository) {
        this.examHallRepository = examHallRepository;
    }

    public ExamHall saveExamHall(ExamHall examHall) {
        return examHallRepository.save(examHall);
    }

    public List<ExamHall> getAllExamHalls() {
        return examHallRepository.findAll();
    }

    public Optional<ExamHall> getExamHallById(Long id) {
        return examHallRepository.findById(id);
    }

    public void deleteExamHall(Long id) {
        examHallRepository.deleteById(id);
    }
}
