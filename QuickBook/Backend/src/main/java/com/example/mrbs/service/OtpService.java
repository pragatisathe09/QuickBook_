package com.example.mrbs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
// import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import lombok.AllArgsConstructor;
import lombok.Data;

@Service
public class OtpService {
    private Map<String, OtpData> otpMap = new HashMap<>();

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpMap.put(email, new OtpData(otp, LocalDateTime.now()));
        sendOtpEmail(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpData otpData = otpMap.get(email);
        if (otpData == null) return false;

        // Check if OTP is not expired (5 minutes validity)
        if (Duration.between(otpData.timestamp, LocalDateTime.now()).toMinutes() > 5) {
            otpMap.remove(email);
            return false;
        }

        boolean isValid = otpData.otp.equals(otp);
        if (isValid) {
            otpMap.remove(email);
        }
        return isValid;
    }

    // private void sendOtpEmail(String email, String otp) {
    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setFrom(fromEmail);
    //     message.setTo(email);
    //     message.setSubject("Your OTP for QuickBook Registration");
    //     message.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");

    //     mailSender.send(message);
    // }

    private void sendOtpEmail(String email, String otp) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(email);
        helper.setSubject("Your OTP for QuickBook Registration");
        
        String htmlContent = 
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<style>" +
                    "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { background-color: #050e1dff; padding: 20px; text-align: center; color: white; }" +
                    ".content { padding: 20px; background-color: #f9f9f9; border: 1px solid #dddddd; }" +
                    ".otp-container { text-align: center; padding: 15px; margin: 20px 0; }" +
                    ".otp-code { font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #4285f4; }" +
                    ".expiry { color: #ff0000; font-weight: bold; }" +
                    ".footer { margin-top: 20px; font-size: 12px; text-align: center; color: #777777; }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class='container'>" +
                    "<div class='header'>" +
                        "<h2>QuickBook Registration</h2>" +
                    "</div>" +
                    "<div class='content'>" +
                        "<p>Hello,</p>" +
                        "<p>Thank you for registering with QuickBook. To complete your registration, please use the following One-Time Password (OTP):</p>" +
                        "<div class='otp-container'>" +
                            "<div class='otp-code'>" + otp + "</div>" +
                        "</div>" +
                        "<p class='expiry'>This OTP is valid for <strong>5 minutes</strong> only.</p>" +
                        "<p>If you did not request this OTP, please ignore this email.</p>" +
                        "<p>Best regards,<br/>The QuickBook Team</p>" +
                    "</div>" +
                    "<div class='footer'>" +
                        "<p>This is an automated message. Please do not reply to this email.</p>" +
                        "<p>&copy; " + java.time.Year.now().getValue() + " QuickBook. All rights reserved.</p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";
        
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    } catch (MessagingException e) {
        throw new RuntimeException("Failed to send OTP email", e);
    }
}

    @Data
    @AllArgsConstructor
    private static class OtpData {
        private String otp;
        private LocalDateTime timestamp;
    }
}