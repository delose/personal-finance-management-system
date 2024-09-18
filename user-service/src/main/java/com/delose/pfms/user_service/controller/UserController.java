package com.delose.pfms.user_service.controller;

import org.springframework.web.bind.annotation.*;

import com.delose.pfms.user_service.entity.User;
import com.delose.pfms.user_service.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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