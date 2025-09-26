package com.example.mrbs.controller;

import com.example.mrbs.dto.FeedbackDto;
import com.example.mrbs.dto.ReservationDto;
import com.example.mrbs.model.Feedback;
import com.example.mrbs.model.Reservation;
import com.example.mrbs.model.User;
import com.example.mrbs.service.FeedbackService;
import com.example.mrbs.service.OtpService;
import com.example.mrbs.service.ReservationService;
import com.example.mrbs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.findByEmail(email);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@Valid @RequestBody User userDetails) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User updatedUser = userService.updateUser(email, userDetails);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.findAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/my_reservations")
    public ResponseEntity<List<Reservation>> getUserReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        List<Reservation> reservations = reservationService.findUserReservations(email);

        return ResponseEntity.ok(reservations);
    }

    @PostMapping("/reservations")
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody ReservationDto reservationDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Reservation newReservation = reservationService.createReservation(email, reservationDto);

        return ResponseEntity.ok(newReservation);
    }

    @PutMapping("/reservations/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id,
            @Valid @RequestBody ReservationDto reservationDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Reservation updatedReservation = reservationService.updateReservation(id, email, reservationDto);

        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        reservationService.cancelReservation(id, email);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> addFeedback(@RequestBody FeedbackDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Feedback feedback = feedbackService.addFeedback(dto, email);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/feedback/room/{roomId}")
    public ResponseEntity<List<Feedback>> getFeedbackByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByRoom(roomId));
    }

    @GetMapping("/feedback/my")
    public ResponseEntity<List<Feedback>> getMyFeedback() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        List<Feedback> feedbacks = feedbackService.getFeedbackByUserEmail(email);
        return ResponseEntity.ok(feedbacks);
    }
}