package com.example.mrbs.dto;

import lombok.Data;

@Data
public class FeedbackDto {
    private Long id;
    private String comment;
    private int rating;
    private Long reservationId;
}
