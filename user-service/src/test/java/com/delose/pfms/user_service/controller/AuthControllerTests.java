package com.delose.pfms.user_service.controller;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.delose.pfms.user_service.dto.UserRegistrationDTO;
import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.repository.UserRepository;

@SpringBootTest
public class AuthControllerTests {

    @Autowired
    private AuthController authController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testUserRegistration() {
        UserRegistrationDTO registrationDTO = new UserRegistrationDTO();
        registrationDTO.setUsername("newuser");
        registrationDTO.setEmail("newuser@example.com");
        registrationDTO.setPassword("password123");

        ResponseEntity<String> response = authController.registerUser(registrationDTO);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();

        UserEntity registeredUser = userRepository.findByUsername("newuser").orElse(null);
        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.getEmail()).isEqualTo("newuser@example.com");
        assertThat(passwordEncoder.matches("password123", registeredUser.getPassword())).isTrue();
    }
}
