package com.company.auth;

import com.company.auth.dto.AuthenticationResponse;
import com.company.exception.AppBadRequestException;
import com.company.users.Role;
import com.company.users.UserEntity;
import com.company.users.UserRepository;
import com.company.users.UserStatus;
import com.company.users.dto.LoginDTO;
import com.company.users.dto.RegisterDTO;
import com.company.users.dto.UserResp;
import com.company.util.JwtUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public UserResp register(RegisterDTO request) {
        if (userRepository.findByEmailAndVisibilityTrue(request.getEmail()).isPresent()) {
            throw new AppBadRequestException("Email allaqachon mavjud!");
        }

        String verificationCode = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(30);

        var user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .visibility(true)
                .status(UserStatus.UNVERIFIED)
                .verificationCode(verificationCode)
                .verificationCodeExpiry(expiryTime)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (MessagingException e) {
            throw new AppBadRequestException("Email yuborishda xatolik yuz berdi!");
        }

        return toDTO(user);
    }

    public UserResp verifyEmail(String email, String code) {
        var user = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(() -> new AppBadRequestException("User topilmadi!"));

        if (user.getStatus() == UserStatus.VERIFIED) {
            throw new AppBadRequestException("Email allaqachon tasdiqlangan!");
        }

        if (!user.getVerificationCode().equals(code)) {
            throw new AppBadRequestException("Tasdiqlash kodi noto'g'ri!");
        }

        if (LocalDateTime.now().isAfter(user.getVerificationCodeExpiry())) {
            throw new AppBadRequestException("Tasdiqlash kodi muddati tugagan!");
        }

        user.setStatus(UserStatus.VERIFIED);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

        return toDTO(user);
    }

    public void requestPasswordReset(String email) {
        var user = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(() -> new AppBadRequestException("User topilmadi!"));

        String resetCode = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(30);

        user.setVerificationCode(resetCode);
        user.setVerificationCodeExpiry(expiryTime);
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(email, resetCode);
        } catch (MessagingException e) {
            throw new AppBadRequestException("Email yuborishda xatolik yuz berdi!");
        }
    }

    public AuthenticationResponse resetPassword(String email, String code, String newPassword) {
        var user = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(() -> new AppBadRequestException("User topilmadi!"));

        if (!user.getVerificationCode().equals(code)) {
            throw new AppBadRequestException("Tasdiqlash kodi noto'g'ri!");
        }

        if (LocalDateTime.now().isAfter(user.getVerificationCodeExpiry())) {
            throw new AppBadRequestException("Tasdiqlash kodi muddati tugagan!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(toDTO(user))
                .build();
    }

    public AuthenticationResponse login(LoginDTO request) {
        var user = userRepository.findByEmailAndVisibilityTrue(request.getEmail())
                .orElseThrow(() -> new AppBadRequestException("Email yoki parol noto'g'ri!"));

        if (user.getStatus() != UserStatus.VERIFIED) {
            throw new AppBadRequestException("Email tasdiqlanmagan!");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(toDTO(user))
                .build();
    }

    public AuthenticationResponse changePassword(String email, String oldPassword, String newPassword) {
        var userEntity = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(() -> new AppBadRequestException("User topilmadi!"));

        if (!passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
            throw new AppBadRequestException("Eski parol noto'g'ri!");
        }

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);

        var jwtToken = jwtUtil.generateToken(userEntity);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(toDTO(userEntity))
                .build();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    private UserResp toDTO(UserEntity user) {
        return UserResp.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .creationDate(LocalDateTime.now())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
} 