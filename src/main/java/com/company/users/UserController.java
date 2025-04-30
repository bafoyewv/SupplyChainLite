package com.company.users;

import com.company.users.dto.UserCr;
import com.company.users.dto.UserResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResp> create(@RequestBody UserCr userCr) {
        return userService.create(userCr);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResp> getById(@PathVariable UUID id) {
        return userService.getById(id);
    }

    @GetMapping
    public ResponseEntity<Page<UserResp>> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return userService.getAll(page, size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResp> update(@PathVariable UUID id, @RequestBody UserCr userCr) {
        return userService.update(id, userCr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return userService.delete(id);
    }



}
