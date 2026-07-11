package com.sems.semsbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "question_paper_audit_logs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QuestionPaperAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_paper_id", nullable = true) // nullable for attempts that fail before fetching
    private QuestionPaper questionPaper;
    
    @Column(name = "exam_id")
    private Long examId; // fallback if question paper doesn't exist yet or is unauthorized

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String action; // e.g., "UPLOAD", "DOWNLOAD", "UNAUTHORIZED_ACCESS_ATTEMPT"

    @Column(nullable = false)
    private String status; // e.g., "SUCCESS", "DENIED"

    @PrePersist
    public void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public QuestionPaperAuditLog() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuestionPaper getQuestionPaper() {
        return questionPaper;
    }

    public void setQuestionPaper(QuestionPaper questionPaper) {
        this.questionPaper = questionPaper;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
