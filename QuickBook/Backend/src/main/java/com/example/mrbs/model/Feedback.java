package com.example.mrbs.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private int rating;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

//package com.example.mrbs.model;
//
//import com.example.mrbs.model.MeetingRoom;
//import com.example.mrbs.model.User;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "feedbacks")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class Feedback {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, length = 1000)
//    private String comment;
//
//    @Column(nullable = false)
//    private int rating;
//
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "room_id", nullable = false)
//    private MeetingRoom meetingRoom;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt = LocalDateTime.now();
//}