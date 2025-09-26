package com.example.mrbs.controller;

import com.example.mrbs.model.MeetingRoom;
import com.example.mrbs.model.Reservation;
import com.example.mrbs.service.MeetingRoomService;
import com.example.mrbs.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private MeetingRoomService roomService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<MeetingRoom>> getAllAvailableRooms() {
        List<MeetingRoom> rooms = roomService.findAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingRoom> getRoomById(@PathVariable Long id) {
        MeetingRoom room = roomService.findById(id);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<MeetingRoom>> getRoomsByLocation(@PathVariable String location) {
        List<MeetingRoom> rooms = roomService.findRoomsByLocation(location);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/capacity/{minCapacity}")
    public ResponseEntity<List<MeetingRoom>> getRoomsByMinCapacity(@PathVariable int minCapacity) {
        List<MeetingRoom> rooms = roomService.findRoomsByMinCapacity(minCapacity);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MeetingRoom>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        List<MeetingRoom> rooms = roomService.findAvailableRoomsForTimeSlot(startTime, endTime);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<Reservation>> getRoomSchedule(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {

        List<Reservation> reservations;
        if (fromDate != null && toDate != null) {
            reservations = reservationService.findReservationsByRoomAndDateRange(id, fromDate, toDate);
        } else {
            reservations = reservationService.findReservationsByRoom(id);
        }

        return ResponseEntity.ok(reservations);
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<MeetingRoom> addRoomFeedback(@PathVariable Long id, @RequestParam String feedback) {
        MeetingRoom room = roomService.addDescription(id, feedback);
        return ResponseEntity.ok(room);
    }
}