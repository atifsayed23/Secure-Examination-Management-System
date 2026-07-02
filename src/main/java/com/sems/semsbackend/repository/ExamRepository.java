package com.sems.semsbackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sems.semsbackend.entity.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    Optional<Exam> findByExamCode(String examCode);

    boolean existsByExamCode(String examCode);

}