package com.sems.semsbackend.service;

import com.sems.semsbackend.dto.SeatingArrangementRequest;
import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.entity.ExamHall;
import com.sems.semsbackend.entity.SeatingArrangement;
import com.sems.semsbackend.entity.Student;
import com.sems.semsbackend.repository.ExamHallRepository;
import com.sems.semsbackend.repository.ExamRepository;
import com.sems.semsbackend.repository.SeatingArrangementRepository;
import com.sems.semsbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatingArrangementService {

    private final SeatingArrangementRepository seatingArrangementRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final ExamHallRepository examHallRepository;

    public SeatingArrangementService(SeatingArrangementRepository seatingArrangementRepository,
                                     StudentRepository studentRepository,
                                     ExamRepository examRepository,
                                     ExamHallRepository examHallRepository) {
        this.seatingArrangementRepository = seatingArrangementRepository;
        this.studentRepository = studentRepository;
        this.examRepository = examRepository;
        this.examHallRepository = examHallRepository;
    }

    public SeatingArrangement createSeatingArrangement(SeatingArrangementRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        ExamHall hall = examHallRepository.findById(request.getExamHallId())
                .orElseThrow(() -> new RuntimeException("Exam Hall not found"));

        SeatingArrangement arrangement = new SeatingArrangement();
        arrangement.setStudent(student);
        arrangement.setExam(exam);
        arrangement.setExamHall(hall);
        arrangement.setSeatNumber(request.getSeatNumber());
        arrangement.setStatus(request.getStatus());

        return seatingArrangementRepository.save(arrangement);
    }

    public List<SeatingArrangement> getAllArrangements() {
        return seatingArrangementRepository.findAll();
    }

    public Optional<SeatingArrangement> getArrangementById(Long id) {
        return seatingArrangementRepository.findById(id);
    }

    public void deleteArrangement(Long id) {
        seatingArrangementRepository.deleteById(id);
    }
}
