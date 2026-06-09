package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @PostMapping
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        User saved = userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User user) {
        User updated = userService.updateUer(userId, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        User user = userService.login(loginRequest.getLoginId(), loginRequest.getPassword());
        return ResponseEntity.ok(user);
    }
}