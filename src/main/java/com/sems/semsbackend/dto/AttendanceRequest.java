package com.sems.semsbackend.dto;

public class AttendanceRequest {

    private Long studentId;
    private Long examId;
    private Long examHallId;
    private String attendanceStatus;

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

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
