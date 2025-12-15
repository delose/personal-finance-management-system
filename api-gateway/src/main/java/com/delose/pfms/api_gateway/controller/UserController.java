package com.delose.pfms.api_gateway.controller;

import com.delose.pfms.api_gateway.entity.User;
import com.delose.pfms.api_gateway.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.security.Principal;
import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public Mono<ResponseEntity<?>> authenticateUser(Mono<Principal> principalMono) {
        return principalMono.flatMap(principal -> {
            // The injected 'principal' is usually the UserDetails object itself.

            // In your specific case, since your User entity likely implements UserDetails:
            if (principal instanceof User) {
                User currentUser = (User) principal;
                return Mono.just(ResponseEntity.ok(currentUser));
            } else if (principal instanceof UsernamePasswordAuthenticationToken) {
                // If the injected object is still the token wrapper, extract the actual principal
                UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) principal;
                User currentUser = (User) token.getPrincipal();
                return Mono.just(ResponseEntity.ok(currentUser));
            } else {
                return Mono.just(ResponseEntity.status(401).build());
            }

        }).defaultIfEmpty(ResponseEntity.status(401).build());
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.allUsers();

        return ResponseEntity.ok(users);
    }
}
