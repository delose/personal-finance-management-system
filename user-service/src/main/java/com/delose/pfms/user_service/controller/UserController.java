package com.delose.pfms.user_service.controller;

import com.delose.pfms.user_service.service.HealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.delose.pfms.user_service.entity.User;
import com.delose.pfms.user_service.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final HealthService healthService;

    public UserController(UserService userService, HealthService healthService) {
        this.userService = userService;
        this.healthService = healthService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthInfo() {
        return this.healthService.getContainerInfo();
    }

    @GetMapping("/{username}")
    public User getUserByUsername(@PathVariable("username") String username) {
        return userService.getUserByUsername(username);
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        // Optionally, hash the password here before saving
        return userService.saveUser(user);
    }
}