package com.example.mrbs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private MeetingRoom room;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @Enumerated(EnumType.STRING)
    @Column
    private ReservationStatus status = ReservationStatus.confirmed;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ReservationStatus {
        confirmed, cancelled, completed
    }
}