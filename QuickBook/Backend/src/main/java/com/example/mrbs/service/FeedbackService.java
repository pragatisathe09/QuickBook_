package com.example.mrbs.service;

import com.example.mrbs.dto.FeedbackDto;
import com.example.mrbs.model.Feedback;
import com.example.mrbs.model.Reservation;
import com.example.mrbs.repository.FeedbackRepository;
import com.example.mrbs.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ReservationRepository reservationRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           ReservationRepository reservationRepository) {
        this.feedbackRepository = feedbackRepository;
        this.reservationRepository = reservationRepository;
    }

    public Feedback addFeedback(FeedbackDto dto, String userEmail) {
        Reservation reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!reservation.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to give feedback for this reservation");
        }

        Feedback feedback = new Feedback();
        feedback.setComment(dto.getComment());
        feedback.setRating(dto.getRating());
        feedback.setReservation(reservation);
        feedback.setUser(reservation.getUser()); // Set the user from the reservation

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbackByRoom(Long roomId) {
        return feedbackRepository.findByReservation_Room_Id(roomId);
    }

    public List<Feedback> getFeedbackByUserEmail(String email) {
        return feedbackRepository.findAll().stream()
                .filter(fb -> fb.getReservation().getUser().getEmail().equals(email))
                .toList();
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
