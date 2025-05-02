package com.company.auth;

import com.company.auth.dto.AuthenticationResponse;
import com.company.exception.AppBadRequestException;
import com.company.users.Role;
import com.company.users.UserEntity;
import com.company.users.UserRepository;
import com.company.users.dto.LoginDTO;
import com.company.users.dto.RegisterDTO;
import com.company.users.dto.UserResp;
import com.company.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public UserResp register(RegisterDTO request) {
        if (userRepository.findByEmailAndVisibilityTrue(request.getEmail()).isPresent()) {
            throw new AppBadRequestException("Email allaqachon mavjud!");
        }

        var user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .visibility(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return toDTO(user);
    }

    public AuthenticationResponse login(LoginDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmailAndVisibilityTrue(request.getEmail())
                .orElseThrow(() -> new AppBadRequestException("Email yoki parol noto'g'ri!"));

        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(toDTO(user))
                .build();
    }

    private UserResp toDTO(UserEntity user) {
        return UserResp.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
} 