package com.delose.pfms.api_gateway.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;

class JwtUserDetailsServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private JwtUserDetailsService jwtUserDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loadUserByUsername_UserExists_ReturnsUserDetails() {
        // Arrange
        User mockUser = new User("testuser", "password", new ArrayList<>());
        when(restTemplate.getForObject("http://user-service/api/v1/users/testuser", User.class))
                .thenReturn(mockUser);

        // Act
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().isEmpty());
    }

    @Test
    void loadUserByUsername_UserDoesNotExist_ThrowsUsernameNotFoundException() {
        // Arrange
        when(restTemplate.getForObject("http://user-service/api/v1/users/nonexistentuser", User.class))
                .thenReturn(null);

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            jwtUserDetailsService.loadUserByUsername("nonexistentuser");
        });
    }
}