package com.delose.pfms.user_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.service.UserService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserEntity> register(@RequestBody UserEntity user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Mono<UserEntity> login(@RequestParam String username, @RequestParam String password) {
        return userService.login(username, password);
    }

    @GetMapping("/find/{username}")
    public Mono<UserEntity> getUserDetails(@PathVariable String username) {
        return userService.getUserDetails(username);
    }
}