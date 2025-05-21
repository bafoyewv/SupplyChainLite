package com.company.auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String verificationCode) throws MessagingException {
        log.info("Sending verification email to: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Email Verification");
        helper.setText("Your verification code is: " + verificationCode);

        mailSender.send(message);
        log.info("Verification email sent successfully to: {}", to);
    }

    public void sendPasswordResetEmail(String to, String resetCode) throws MessagingException {
        log.info("Sending password reset email to: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Password Reset");
        helper.setText("Your password reset code is: " + resetCode + "\nThis code will expire in 30 minutes.");

        mailSender.send(message);
        log.info("Password reset email sent successfully to: {}", to);
    }
} 