package com.sems.semsbackend.repository;

import com.sems.semsbackend.entity.ExamHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExamHallRepository extends JpaRepository<ExamHall, Long> {
    Optional<ExamHall> findByHallNumber(String hallNumber);
}
