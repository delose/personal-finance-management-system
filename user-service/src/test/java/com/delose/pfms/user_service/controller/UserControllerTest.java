package com.delose.pfms.user_service.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.delose.pfms.user_service.entity.User;
import com.delose.pfms.user_service.service.UserService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void getUserByUsername_UserExists_ReturnsUser_Success() throws Exception {
        // Arrange
        User mockUser = new User("testuser", "password", "testuser@example.com");
        when(userService.getUserByUsername("testuser")).thenReturn(mockUser);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.password").value("password"))
                .andExpect(jsonPath("$.email").value("testuser@example.com"));

        verify(userService, times(1)).getUserByUsername("testuser");
    }

    @Test
    void registerUser_ValidUser_ReturnsUser() throws Exception {
        // Arrange
        User mockUser = new User("testuser", "password", "testuser@example.com");
        when(userService.saveUser(any(User.class))).thenReturn(mockUser);

        // Act & Assert
        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testuser\",\"password\":\"password\",\"email\":\"testuser@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.password").value("password"))
                .andExpect(jsonPath("$.email").value("testuser@example.com"));

        verify(userService, times(1)).saveUser(any(User.class));
    }
}