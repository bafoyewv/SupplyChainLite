package com.company.users;

import com.company.exception.AppBadRequestException;
import com.company.users.dto.UserCr;
import com.company.users.dto.UserResp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public ResponseEntity<UserResp> create(UserCr userCr) {
        Optional<UserEntity> optionalUser = userRepository
                .findByEmailAndVisibilityTrue(userCr.getEmail());
        if (optionalUser.isPresent()) {
            throw new AppBadRequestException("User Already Exists!!!");
        }
        UserEntity saved = userRepository.save(UserEntity
                .builder()
                .fullName(userCr.getFullName())
                .email(userCr.getEmail())
                .createdAt(LocalDateTime.now())
                .visibility(true)
                .role(Role.USER)
                .build());

        return ResponseEntity.ok(
                toDTO(saved)
        );

    }



    private UserResp toDTO(UserEntity userEntity) {
        return UserResp.builder()
                .id(userEntity.getId())
                .fullName(userEntity.getFullName())
                .email(userEntity.getEmail())
                .role(userEntity.getRole())
                .build();

    }
}
