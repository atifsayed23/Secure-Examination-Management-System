package com.sems.semsbackend.service;

import com.sems.semsbackend.dto.HallTicketDTO;
import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.entity.ExamHall;
import com.sems.semsbackend.entity.SeatingArrangement;
import com.sems.semsbackend.entity.Student;
import com.sems.semsbackend.repository.SeatingArrangementRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class HallTicketService {

    private final SeatingArrangementRepository seatingArrangementRepository;

    public HallTicketService(SeatingArrangementRepository seatingArrangementRepository) {
        this.seatingArrangementRepository = seatingArrangementRepository;
    }

    public HallTicketDTO generateHallTicket(Long studentId, Long examId) {
        SeatingArrangement seatingArrangement = seatingArrangementRepository
                .findByStudentIdAndExamId(studentId, examId)
                .orElseThrow(() -> new RuntimeException("Seating arrangement not found for Student ID " + studentId + " and Exam ID " + examId));

        Student student = seatingArrangement.getStudent();
        Exam exam = seatingArrangement.getExam();
        ExamHall hall = seatingArrangement.getExamHall();

        HallTicketDTO hallTicket = new HallTicketDTO();
        
        // Student Details
        hallTicket.setStudentName(student.getFullName());
        hallTicket.setEnrollmentNumber(student.getEnrollmentNumber());
        hallTicket.setStudentEmail(student.getEmail());
        hallTicket.setSemester(student.getSemester());
        hallTicket.setDepartment(student.getDepartment());

        // Exam Details
        hallTicket.setExamName(exam.getExamName());
        hallTicket.setExamCode(exam.getExamCode());
        hallTicket.setExamDate(exam.getExamDate());
        hallTicket.setDurationMinutes(exam.getDuration());

        // Hall Details
        hallTicket.setBuilding(hall.getBuilding());
        hallTicket.setHallNumber(hall.getHallNumber());
        hallTicket.setFloor(hall.getFloor());

        // Seat Number
        hallTicket.setSeatNumber(seatingArrangement.getSeatNumber());

        // Instructions
        hallTicket.setInstructions(Arrays.asList(
                "Bring a valid photo ID card.",
                "Electronic devices (mobiles, smartwatches, etc.) are strictly prohibited.",
                "Report to the exam hall at least 30 minutes before the commencement of the exam.",
                "Do not carry any unauthorized material into the examination hall."
        ));

        try {
            com.sems.semsbackend.repository.UserRepository userRepository = org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
            ).getBean(com.sems.semsbackend.repository.UserRepository.class);
            
            NotificationService notificationService = org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
            ).getBean(NotificationService.class);
            
            userRepository.findByEmail(student.getEmail()).ifPresent(user -> {
                notificationService.createNotification(user,
                    "Hall Ticket Generated",
                    "Your hall ticket for " + exam.getExamName() + " has been successfully generated.",
                    "SUCCESS"
                );
            });
        } catch (Exception e) {}

        return hallTicket;
    }
}
