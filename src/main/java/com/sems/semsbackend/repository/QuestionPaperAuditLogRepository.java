package com.sems.semsbackend.repository;

import com.sems.semsbackend.entity.QuestionPaperAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionPaperAuditLogRepository extends JpaRepository<QuestionPaperAuditLog, Long> {
    List<QuestionPaperAuditLog> findByExamIdOrderByTimestampDesc(Long examId);
}
