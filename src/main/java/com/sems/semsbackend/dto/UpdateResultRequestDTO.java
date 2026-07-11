package com.sems.semsbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class UpdateResultRequestDTO {

    @NotNull(message = "Marks obtained is required")
    @PositiveOrZero(message = "Marks cannot be negative")
    private Integer marksObtained;

    public Integer getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Integer marksObtained) {
        this.marksObtained = marksObtained;
    }
}
