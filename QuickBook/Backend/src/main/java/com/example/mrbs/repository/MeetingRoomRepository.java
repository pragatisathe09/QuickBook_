package com.example.mrbs.repository;

import com.example.mrbs.model.MeetingRoom;
import com.example.mrbs.model.MeetingRoom.RoomAvailability;
import com.example.mrbs.model.MeetingRoom.RoomLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {

    List<MeetingRoom> findByAvailability(RoomAvailability availability);

    List<MeetingRoom> findByLocation(RoomLocation location);

    @Query("SELECT m FROM MeetingRoom m WHERE m.capacity >= :capacity")
    List<MeetingRoom> findByMinCapacity(@Param("capacity") int capacity);

    @Query("""
        SELECT DISTINCT m FROM MeetingRoom m 
        WHERE m.id NOT IN (
            SELECT r.room.id FROM Reservation r 
            WHERE r.status = 'confirmed' 
            AND ((r.startTime <= :endTime AND r.endTime >= :startTime))
        )
    """)
    List<MeetingRoom> findAvailableRoomsForTimeSlot(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}