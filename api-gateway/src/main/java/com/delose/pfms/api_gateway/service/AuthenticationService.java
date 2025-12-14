package com.delose.pfms.api_gateway.service;

import com.delose.pfms.api_gateway.dto.LoginUserDto;
import com.delose.pfms.api_gateway.dto.RegisterUserDto;
import com.delose.pfms.api_gateway.entity.User;
import com.delose.pfms.api_gateway.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User signup(RegisterUserDto dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto dto) {
        authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(
                  dto.getEmail(),
                  dto.getPassword()
          )
        );
        return userRepository.findByEmail(dto.getEmail())
                .orElseThrow();
    }
}
