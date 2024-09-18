package com.delose.pfms.api_gateway.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import com.delose.pfms.api_gateway.model.JwtRequest;
import com.delose.pfms.api_gateway.model.JwtResponse;
import com.delose.pfms.api_gateway.service.JwtTokenUtil;
import com.delose.pfms.api_gateway.service.JwtUserDetailsService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private JwtUserDetailsService userDetailsService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createAuthenticationToken_ValidCredentials_ReturnsJwtResponse() throws Exception {
        // Arrange
        JwtRequest jwtRequest = new JwtRequest("testuser", "password");
        UserDetails mockUserDetails = mock(UserDetails.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userDetailsService.loadUserByUsername("testuser"))
                .thenReturn(mockUserDetails);
        when(jwtTokenUtil.generateToken(mockUserDetails))
                .thenReturn("test-token");

        // Act
        JwtResponse jwtResponse = authController.createAuthenticationToken(jwtRequest);

        // Assert
        assertEquals("test-token", jwtResponse.getJwttoken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userDetailsService).loadUserByUsername("testuser");
        verify(jwtTokenUtil).generateToken(mockUserDetails);
    }

    @Test
    void createAuthenticationToken_InvalidCredentials_ThrowsException() throws Exception {
        // Arrange
        JwtRequest jwtRequest = new JwtRequest("testuser", "wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act & Assert
        try {
            authController.createAuthenticationToken(jwtRequest);
        } catch (Exception ex) {
            assertEquals("Invalid credentials", ex.getMessage());
        }

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(jwtTokenUtil, never()).generateToken(any(UserDetails.class));
    }
}