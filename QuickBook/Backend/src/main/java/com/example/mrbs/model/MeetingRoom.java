package com.example.mrbs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Room name is required")
    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomLocation location;

    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column
    private RoomAvailability availability = RoomAvailability.Available;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageURL;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RoomLocation {
        Hyderabad,
        @Column(name = "Pune, Wadgaonsheri")
        Pune_Wadgaonsheri,
        @Column(name = "Pune, Baner")
        Pune_Baner
    }

    public enum RoomAvailability {
        Available, Under_Maintenance
    }
}