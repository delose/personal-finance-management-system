package com.delose.pfms.user_service.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.delose.pfms.user_service.entity.User;
import com.delose.pfms.user_service.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserByUsername_UserExists_ReturnsUser() {
        // Given
        User mockUser = new User("testuser", "password", "testuser@example.com");
        when(userRepository.findByUsername("testuser")).thenReturn(mockUser);

        // When
        User user = userService.getUserByUsername("testuser");

        // Then
        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
        assertEquals("password", user.getPassword());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void saveUser_ValidUser_SavesUser() {
        // Given
        User mockUser = new User("testuser", "password", "testuser@example.com");
        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // When
        userService.saveUser(mockUser);

        // Then
        verify(userRepository, times(1)).save(mockUser);
    }
}