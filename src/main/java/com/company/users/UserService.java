package com.company.users;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.users.dto.UserCr;
import com.company.users.dto.UserResp;
import com.company.users.dto.LoginDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
                .password(userCr.getPassword())
                .createdAt(LocalDateTime.now())
                .visibility(true)
                .role(Role.USER)
                .build());

        return ResponseEntity.ok(
                toDTO(saved)
        );

    }

    public ResponseEntity<UserResp> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        UserEntity userEntity = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(ItemNotFoundException::new);
                
        return ResponseEntity.ok(toDTO(userEntity));
    }

    public ResponseEntity<UserResp> updateProfile(UserCr userCr) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        UserEntity userEntity = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(ItemNotFoundException::new);

        Optional<UserEntity> optionalUser = userRepository.findByEmailAndVisibilityTrue(userCr.getEmail());
        if (optionalUser.isPresent() && !optionalUser.get().getId().equals(userEntity.getId())) {
            throw new AppBadRequestException("Email allaqachon mavjud!");
        }

        userEntity.setFullName(userCr.getFullName());
        userEntity.setEmail(userCr.getEmail());
        userEntity.setPassword(userCr.getPassword());
        UserEntity saved = userRepository.save(userEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<Page<UserResp>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt"));

        List<UserResp> list = userRepository
                .findAllByVisibilityTrue(pageable)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                new PageImpl<>(list, pageable, list.size())
        );
    }

    public ResponseEntity<UserResp>  updateRoleToAdmin(UserCr userCr, String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserEntity userEntity = userRepository.findByEmailAndVisibilityTrue(email)
                .orElseThrow(ItemNotFoundException::new);

        Optional<UserEntity> optionalUser = userRepository.findByEmailAndVisibilityTrue(userCr.getEmail());

        if (optionalUser.isPresent() && optionalUser.get().getUsername().equals(username)) {

            userEntity.setRole(Role.ADMIN);
            UserEntity saved = userRepository.save(userEntity);
            return ResponseEntity.ok(toDTO(saved));
        }
        return AppBadRequestException;


    }

    public ResponseEntity<UserResp> getById(UUID id) {
        UserEntity userEntity = getUserEntityById(id);
        return ResponseEntity.ok(toDTO(userEntity));
    }

    public ResponseEntity<String> delete(UUID id) {
        UserEntity userEntity = getUserEntityById(id);
        userEntity.setVisibility(false);
        userRepository.save(userEntity);
        return ResponseEntity.ok("User Deleted Successfully");
    }

    public ResponseEntity<UserResp> login(LoginDTO loginDTO) {
        Optional<UserEntity> optionalUser = userRepository
                .findByEmailAndPasswordAndVisibilityTrue(loginDTO.getEmail(), loginDTO.getPassword());
        
        if (optionalUser.isEmpty()) {
            throw new AppBadRequestException("Email yoki parol noto'g'ri!");
        }

        return ResponseEntity.ok(toDTO(optionalUser.get()));
    }

    private UserResp toDTO(UserEntity userEntity) {
        return UserResp.builder()
                .id(userEntity.getId())
                .fullName(userEntity.getFullName())
                .email(userEntity.getEmail())
                .role(userEntity.getRole())
                .build();

    }

    private UserEntity getUserEntityById(UUID id) {
        return userRepository.findByIdAndVisibilityTrue(id)
                .orElseThrow(ItemNotFoundException::new);
    }

}
