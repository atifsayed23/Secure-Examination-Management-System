package com.sems.semsbackend.repository;

import com.sems.semsbackend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByExamId(Long examId);
    List<Attendance> findByExamHallId(Long examHallId);
    List<Attendance> findByStudentId(Long studentId);
}
