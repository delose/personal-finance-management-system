package com.delose.pfms.user_service.service.impl;

import com.delose.pfms.user_service.dto.UserRegistrationDTO;
import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.exception.UserException;
import com.delose.pfms.user_service.repository.UserRepository;
import com.delose.pfms.user_service.service.UserService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity register(UserRegistrationDTO registrationDTO) throws UserException {
        // Check if username or email already exists
        Optional<UserEntity> existingUserByUsername = userRepository.findByUsername(registrationDTO.getUsername());
        if (existingUserByUsername.isPresent()) {
            throw new UserException("Username is already taken.");
        }

        Optional<UserEntity> existingUserByEmail = userRepository.findByEmail(registrationDTO.getEmail());
        if (existingUserByEmail.isPresent()) {
            throw new UserException("Email is already registered.");
        }

        // Create new user
        UserEntity user = new UserEntity();
        user.setUsername(registrationDTO.getUsername());
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setRoles("ROLE_USER");

        return userRepository.save(user);
    }
}