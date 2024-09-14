package com.delose.pfms.user_service.service.impl;

import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.repository.UserRepository;
import com.delose.pfms.user_service.service.UserService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Mono<UserEntity> register(UserEntity user) {
        return userRepository.findByUsername(user.getUsername())
                .flatMap(existingUser -> Mono.error(new IllegalStateException("Username already exists")))
                .switchIfEmpty(Mono.defer(() -> {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                    return userRepository.save(user);
                }))
                .cast(UserEntity.class);
    }

    @Override
    public Mono<UserEntity> login(String username, String password) {
        return userRepository.findByUsername(username)
                .flatMap(user -> passwordEncoder.matches(password, user.getPassword())
                        ? Mono.just(user)
                        : Mono.error(new IllegalArgumentException("Invalid credentials")));
    }

    @Override
    public Mono<UserEntity> getUserDetails(String username) {
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("User not found")));
    }
}