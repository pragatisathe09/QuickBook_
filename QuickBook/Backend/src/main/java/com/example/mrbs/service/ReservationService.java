package com.example.mrbs.service;

import com.example.mrbs.dto.ReservationDto;
import com.example.mrbs.exception.ResourceNotFoundException;
import com.example.mrbs.exception.RoomNotAvailableException;
import com.example.mrbs.model.MeetingRoom;
import com.example.mrbs.model.Reservation;
import com.example.mrbs.model.Reservation.ReservationStatus;
import com.example.mrbs.model.User;
import com.example.mrbs.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MeetingRoomService roomService;

    @Transactional(readOnly = true)
    public List<Reservation> findAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Reservation> findUserReservations(String email) {
        return reservationRepository.findByUserEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Reservation> findReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Reservation> findReservationsByRoom(Long roomId) {
        return reservationRepository.findByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public List<Reservation> findReservationsByRoomAndDateRange(Long roomId, LocalDateTime fromDate, LocalDateTime toDate) {
        return reservationRepository.findByRoomIdAndDateRange(roomId, fromDate, toDate);
    }

    @Transactional
    public Reservation createReservation(String userEmail, ReservationDto reservationDto) {
        User user = userService.findByEmail(userEmail);
        MeetingRoom room = roomService.findById(reservationDto.getRoomId());

        // Validate time slot
        LocalDateTime startTime = reservationDto.getStartTime();
        LocalDateTime endTime = reservationDto.getEndTime();

        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time cannot be in the past");
        }

        // Check if room is available for the specified time slot
        boolean isOverlapping = reservationRepository.existsOverlappingReservation(
                room.getId(), startTime, endTime);

        if (isOverlapping) {
            throw new RoomNotAvailableException(room.getId(),
                    "from " + startTime + " to " + endTime);
        }

        // Create reservation
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setTitle(reservationDto.getTitle());
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setStatus(ReservationStatus.confirmed);
        reservation.setAmenities(reservationDto.getAmenities());

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation updateReservation(Long id, String userEmail, ReservationDto reservationDto) {
        Reservation reservation = findById(id);
        User user = userService.findByEmail(userEmail);

        // Check if the reservation belongs to the user
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You don't have permission to update this reservation");
        }

        // If room is changed, validate availability
        Long newRoomId = reservationDto.getRoomId();
        if (!reservation.getRoom().getId().equals(newRoomId)) {
            MeetingRoom newRoom = roomService.findById(newRoomId);

            // Check if new room is available for the specified time slot
            boolean isOverlapping = reservationRepository.existsOverlappingReservation(
                    newRoomId, reservationDto.getStartTime(), reservationDto.getEndTime());

            if (isOverlapping) {
                throw new RoomNotAvailableException(newRoomId,
                        "from " + reservationDto.getStartTime() + " to " + reservationDto.getEndTime());
            }
        }
        // If time slot is changed but room remains the same, validate availability
        else if (!reservation.getStartTime().equals(reservationDto.getStartTime()) ||
                !reservation.getEndTime().equals(reservationDto.getEndTime())) {

            // Check if room is available for the new time slot (excluding current reservation)
            boolean isOverlapping = reservationRepository.existsOverlappingReservationExcludingThis(
                    id, newRoomId, reservationDto.getStartTime(), reservationDto.getEndTime());

            if (isOverlapping) {
                throw new RoomNotAvailableException(newRoomId,
                        "from " + reservationDto.getStartTime() + " to " + reservationDto.getEndTime());
            }
        }

        // Update reservation details
        reservation.setTitle(reservationDto.getTitle());
        reservation.setStartTime(reservationDto.getStartTime());
        reservation.setEndTime(reservationDto.getEndTime());
        reservation.setAmenities(reservationDto.getAmenities());

        return reservationRepository.save(reservation);
    }

    @Transactional
    public void cancelReservation(Long id, String userEmail) {
        Reservation reservation = findById(id);
        User user = userService.findByEmail(userEmail);

        // Check if the reservation belongs to the user or user is admin
        if (!reservation.getUser().getId().equals(user.getId()) &&
                !user.getRole().equals(User.UserRole.admin)) {
            throw new IllegalArgumentException("You don't have permission to cancel this reservation");
        }

        // Update reservation status
        reservation.setStatus(ReservationStatus.cancelled);
        reservationRepository.save(reservation);

    }

    @Transactional
    public Reservation updateReservationStatus(Long id, String status) {
        Reservation reservation = findById(id);

        try {
            ReservationStatus newStatus = ReservationStatus.valueOf(status);

            reservation.setStatus(newStatus);
            return reservationRepository.save(reservation);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    @Scheduled(fixedRate = 60000) // runs every minute
    public void updateReservationStatuses() {
        reservationRepository.markCompletedReservations(LocalDateTime.now());
        System.out.println("Running scheduled task to update reservation statuses...");
    }
}