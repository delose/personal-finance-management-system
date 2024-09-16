package com.delose.pfms.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.delose.pfms.user_service.dto.UserRegistrationDTO;
import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.service.UserService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Validated @RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserEntity newUser = userService.register(registrationDTO);
            return ResponseEntity.ok("User registered successfully with ID: " + newUser.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}