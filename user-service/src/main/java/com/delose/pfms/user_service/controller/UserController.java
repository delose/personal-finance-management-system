package com.delose.pfms.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class UserController {

    @GetMapping("/users/test")
    public Mono<String> testEndpoint() {
        return Mono.just("User Service is up and running!");
    }
}