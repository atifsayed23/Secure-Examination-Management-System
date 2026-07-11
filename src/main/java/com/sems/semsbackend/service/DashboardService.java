package com.sems.semsbackend.service;

import com.sems.semsbackend.dto.DashboardExamSummaryDTO;
import com.sems.semsbackend.dto.DashboardSummaryDTO;
import com.sems.semsbackend.entity.Exam;
import com.sems.semsbackend.exception.ResourceNotFoundException;
import com.sems.semsbackend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final ExamHallRepository examHallRepository;
    private final SeatingArrangementRepository seatingArrangementRepository;
    private final AttendanceRepository attendanceRepository;
    private final QuestionPaperRepository questionPaperRepository;
    private final ResultRepository resultRepository;

    private final FacultyRepository facultyRepository;

    public DashboardService(StudentRepository studentRepository,
                            UserRepository userRepository,
                            ExamRepository examRepository,
                            ExamHallRepository examHallRepository,
                            SeatingArrangementRepository seatingArrangementRepository,
                            AttendanceRepository attendanceRepository,
                            QuestionPaperRepository questionPaperRepository,
                            ResultRepository resultRepository,
                            FacultyRepository facultyRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.examRepository = examRepository;
        this.examHallRepository = examHallRepository;
        this.seatingArrangementRepository = seatingArrangementRepository;
        this.attendanceRepository = attendanceRepository;
        this.questionPaperRepository = questionPaperRepository;
        this.resultRepository = resultRepository;
        this.facultyRepository = facultyRepository;
    }

    public DashboardSummaryDTO getGlobalSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        summary.setTotalStudents(studentRepository.count());
        summary.setTotalFaculty(facultyRepository.count());
        summary.setTotalExams(examRepository.count());
        summary.setTotalExamHalls(examHallRepository.count());
        summary.setTotalSeatingArrangements(seatingArrangementRepository.count());
        summary.setAttendanceMarked(attendanceRepository.count());
        summary.setPresentStudents(attendanceRepository.countByAttendanceStatus("PRESENT"));
        summary.setAbsentStudents(attendanceRepository.countByAttendanceStatus("ABSENT"));
        summary.setQuestionPapersUploaded(questionPaperRepository.count());
        summary.setPublishedResults(resultRepository.countByPublishedTrue());

        return summary;
    }

    public DashboardExamSummaryDTO getExamSummary(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        DashboardExamSummaryDTO summary = new DashboardExamSummaryDTO();
        summary.setExamName(exam.getExamName());
        summary.setRegisteredStudents(seatingArrangementRepository.countByExamId(examId));
        summary.setPresent(attendanceRepository.countByExamIdAndAttendanceStatus(examId, "PRESENT"));
        summary.setAbsent(attendanceRepository.countByExamIdAndAttendanceStatus(examId, "ABSENT"));
        summary.setResultsPublished(resultRepository.existsByExamIdAndPublishedTrue(examId));

        return summary;
    }
}
