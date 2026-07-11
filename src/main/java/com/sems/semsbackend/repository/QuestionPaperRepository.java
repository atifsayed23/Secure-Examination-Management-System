package com.sems.semsbackend.repository;

import com.sems.semsbackend.entity.QuestionPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionPaperRepository extends JpaRepository<QuestionPaper, Long> {
    Optional<QuestionPaper> findByExamId(Long examId);
}
