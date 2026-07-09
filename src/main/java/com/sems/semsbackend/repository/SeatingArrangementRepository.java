package com.sems.semsbackend.repository;

import com.sems.semsbackend.entity.SeatingArrangement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatingArrangementRepository extends JpaRepository<SeatingArrangement, Long> {
    List<SeatingArrangement> findByExamId(Long examId);
    List<SeatingArrangement> findByExamHallId(Long examHallId);
    List<SeatingArrangement> findByStudentId(Long studentId);
}
