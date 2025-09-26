package com.example.mrbs.dto;

import com.example.mrbs.model.MeetingRoom.RoomAvailability;
import com.example.mrbs.model.MeetingRoom.RoomLocation;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {

    @NotBlank(message = "Room name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String availability;

    private String description;

    private String imageURL;
}
