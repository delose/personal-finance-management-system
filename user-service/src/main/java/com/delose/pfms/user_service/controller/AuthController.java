package com.delose.pfms.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.delose.pfms.user_service.dto.JwtRequest;
import com.delose.pfms.user_service.dto.JwtResponse;
import com.delose.pfms.user_service.dto.UserRegistrationDTO;
import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.security.JwtTokenUtil;
import com.delose.pfms.user_service.service.UserService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final JwtTokenUtil jwtTokenUtil;

    private final UserService userService;

    public AuthController(UserService userService, JwtTokenUtil jwtTokenUtil, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String token = jwtTokenUtil.generateToken(authentication);

        return ResponseEntity.ok(new JwtResponse(token));
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