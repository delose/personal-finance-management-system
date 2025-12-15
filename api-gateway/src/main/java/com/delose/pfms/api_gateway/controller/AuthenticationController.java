package com.delose.pfms.api_gateway.controller;

import com.delose.pfms.api_gateway.dto.LoginResponseDto;
import com.delose.pfms.api_gateway.dto.LoginUserDto;
import com.delose.pfms.api_gateway.dto.RegisterUserDto;
import com.delose.pfms.api_gateway.entity.User;
import com.delose.pfms.api_gateway.service.AuthenticationService;
import com.delose.pfms.api_gateway.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public Mono<ResponseEntity<User>> register(@RequestBody RegisterUserDto registerUserDto) {
        log.info("Received signup request for email: {}", registerUserDto.getEmail());

        return Mono.just(authenticationService.signup(registerUserDto))
                .map(ResponseEntity::ok)
                .doOnSuccess(user -> log.info("Successfully registered user."))
                .doOnError(e -> log.error("Error during registration", e));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setToken(jwtToken);
        loginResponseDto.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponseDto);
    }
}
