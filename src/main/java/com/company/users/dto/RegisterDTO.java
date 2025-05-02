package com.company.users.dto;

import com.company.users.Role;
import lombok.Data;

@Data
public class RegisterDTO {
    private String fullName;
    private String email;
    private String password;
    private Role role;
} 