package com.delose.pfms.user_service.service;

import org.springframework.stereotype.Service;

import com.delose.pfms.user_service.entity.User;
import com.delose.pfms.user_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}