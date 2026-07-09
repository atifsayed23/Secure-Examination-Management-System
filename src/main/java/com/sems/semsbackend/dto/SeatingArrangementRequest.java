package com.sems.semsbackend.dto;

public class SeatingArrangementRequest {

    private Long studentId;
    private Long examId;
    private Long examHallId;
    private String seatNumber;
    private String status;

    // Getters and Setters

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Long getExamHallId() {
        return examHallId;
    }

    public void setExamHallId(Long examHallId) {
        this.examHallId = examHallId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
