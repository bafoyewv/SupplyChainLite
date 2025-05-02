package com.company.users;

import com.company.users.dto.UserCr;
import com.company.users.dto.UserResp;
import com.company.users.dto.LoginDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserResp> login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }

    @PostMapping
    public ResponseEntity<UserResp> create(@RequestBody UserCr userCr) {
        return userService.create(userCr);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'STORE_OWNER', 'STAFF', 'SUPPLIER')")
    public ResponseEntity<UserResp> getProfile() {
        return userService.getProfile();
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'STORE_OWNER', 'STAFF', 'SUPPLIER')")
    public ResponseEntity<UserResp> updateProfile(@RequestBody UserCr userCr) {
        return userService.updateProfile(userCr);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResp>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return userService.getAll(page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResp> getById(@PathVariable UUID id) {
        return userService.getById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return userService.delete(id);
    }
}
