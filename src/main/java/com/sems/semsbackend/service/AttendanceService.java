package com.sems.semsbackend.service;

import com.sems.semsbackend.dto.AttendanceRequest;
import com.sems.semsbackend.entity.Attendance;
import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.entity.ExamHall;
import com.sems.semsbackend.entity.Student;
import com.sems.semsbackend.repository.AttendanceRepository;
import com.sems.semsbackend.repository.ExamHallRepository;
import com.sems.semsbackend.repository.ExamRepository;
import com.sems.semsbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final ExamHallRepository examHallRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository,
                             ExamRepository examRepository,
                             ExamHallRepository examHallRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.examRepository = examRepository;
        this.examHallRepository = examHallRepository;
    }

    public Attendance createAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        ExamHall hall = examHallRepository.findById(request.getExamHallId())
                .orElseThrow(() -> new RuntimeException("Exam Hall not found"));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setExam(exam);
        attendance.setExamHall(hall);
        attendance.setAttendanceStatus(request.getAttendanceStatus());
        attendance.setAttendanceTime(LocalDateTime.now()); // Automatically record time

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    public Attendance updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            attendance.setStudent(student);
        }

        if (request.getExamId() != null) {
            Exam exam = examRepository.findById(request.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
            attendance.setExam(exam);
        }

        if (request.getExamHallId() != null) {
            ExamHall hall = examHallRepository.findById(request.getExamHallId())
                    .orElseThrow(() -> new RuntimeException("Exam Hall not found"));
            attendance.setExamHall(hall);
        }

        if (request.getAttendanceStatus() != null) {
            attendance.setAttendanceStatus(request.getAttendanceStatus());
        }

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}
