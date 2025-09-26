package com.example.mrbs.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.CONFLICT)
public class RoomNotAvailableException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public RoomNotAvailableException(String message) {
        super(message);
    }

    public RoomNotAvailableException(Long roomId, String timeSlot) {
        super(String.format("Room with ID %d is not available for the time slot: %s", roomId, timeSlot));
    }
}