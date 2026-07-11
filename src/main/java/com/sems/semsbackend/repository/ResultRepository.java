package com.sems.semsbackend.repository;

import com.sems.semsbackend.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudentId(Long studentId);

    List<Result> findByStudentIdAndPublishedTrue(Long studentId);

    List<Result> findByStudentEmailAndPublishedTrue(String email);

    List<Result> findByExamId(Long examId);

    Optional<Result> findByStudentIdAndExamId(Long studentId, Long examId);

    long countByPublishedTrue();

    boolean existsByExamIdAndPublishedTrue(Long examId);

    @Modifying
    @Query("UPDATE Result r SET r.published = true, r.publishedAt = :publishedAt WHERE r.exam.id = :examId AND r.published = false")
    int publishResultsForExam(@Param("examId") Long examId, @Param("publishedAt") LocalDateTime publishedAt);
}
