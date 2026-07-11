package com.sems.semsbackend.dto;

public class DashboardSummaryDTO {

    private long totalStudents;
    private long totalFaculty;
    private long totalExams;
    private long totalExamHalls;
    private long totalSeatingArrangements;
    private long attendanceMarked;
    private long presentStudents;
    private long absentStudents;
    private long questionPapersUploaded;
    private long publishedResults;

    public DashboardSummaryDTO() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalFaculty() {
        return totalFaculty;
    }

    public void setTotalFaculty(long totalFaculty) {
        this.totalFaculty = totalFaculty;
    }

    public long getTotalExams() {
        return totalExams;
    }

    public void setTotalExams(long totalExams) {
        this.totalExams = totalExams;
    }

    public long getTotalExamHalls() {
        return totalExamHalls;
    }

    public void setTotalExamHalls(long totalExamHalls) {
        this.totalExamHalls = totalExamHalls;
    }

    public long getTotalSeatingArrangements() {
        return totalSeatingArrangements;
    }

    public void setTotalSeatingArrangements(long totalSeatingArrangements) {
        this.totalSeatingArrangements = totalSeatingArrangements;
    }

    public long getAttendanceMarked() {
        return attendanceMarked;
    }

    public void setAttendanceMarked(long attendanceMarked) {
        this.attendanceMarked = attendanceMarked;
    }

    public long getPresentStudents() {
        return presentStudents;
    }

    public void setPresentStudents(long presentStudents) {
        this.presentStudents = presentStudents;
    }

    public long getAbsentStudents() {
        return absentStudents;
    }

    public void setAbsentStudents(long absentStudents) {
        this.absentStudents = absentStudents;
    }

    public long getQuestionPapersUploaded() {
        return questionPapersUploaded;
    }

    public void setQuestionPapersUploaded(long questionPapersUploaded) {
        this.questionPapersUploaded = questionPapersUploaded;
    }

    public long getPublishedResults() {
        return publishedResults;
    }

    public void setPublishedResults(long publishedResults) {
        this.publishedResults = publishedResults;
    }
}
