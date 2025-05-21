package com.company.auth;

import com.company.auth.dto.AuthenticationResponse;
import com.company.users.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<UserResp> register(@RequestBody RegisterDTO request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<UserResp> verifyEmail(@RequestBody VerifyEmailDTO request) {
        return ResponseEntity.ok(authenticationService.verifyEmail(request.getEmail(), request.getCode()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginDTO request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }



    @PostMapping("/request-password-reset")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody EmailRequestDTO request) {
        authenticationService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthenticationResponse> resetPassword(@RequestBody PasswordResetDTO request) {
        return ResponseEntity.ok(authenticationService.resetPassword(
                request.getEmail(),
                request.getCode(),
                request.getNewPassword()
        ));
    }

    @PostMapping("/changePass")
    public ResponseEntity<AuthenticationResponse> changePass(@RequestBody ChangePasswordDTO request) {
        return ResponseEntity.ok(authenticationService.changePassword(
                request.getEmail(),
                request.getOldPassword(),
                request.getNewPassword()
        ));
    }
} 