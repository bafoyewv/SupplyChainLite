package com.company.users.dto;

import com.company.users.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResp {
    private UUID id;
    private String fullName;
    private String email;
    private LocalDateTime creationDate = LocalDateTime.now();
    private Role role;

}
