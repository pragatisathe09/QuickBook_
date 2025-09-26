package com.example.mrbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MeetingBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeetingBookingApplication.class, args);
    }
}