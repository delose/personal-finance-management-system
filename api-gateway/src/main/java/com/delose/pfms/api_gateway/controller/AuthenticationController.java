package com.delose.pfms.api_gateway.controller;

import com.delose.pfms.api_gateway.dto.LoginResponseDto;
import com.delose.pfms.api_gateway.dto.LoginUserDto;
import com.delose.pfms.api_gateway.dto.RegisterUserDto;
import com.delose.pfms.api_gateway.entity.User;
import com.delose.pfms.api_gateway.service.AuthenticationService;
import com.delose.pfms.api_gateway.service.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RequestMapping("/auth")
@Slf4j
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
    public Mono<ResponseEntity<?>> register(@RequestBody RegisterUserDto registerUserDto) {
        log.info("Received signup request for email: {}", registerUserDto.getEmail());

        return Mono.fromCallable(() -> authenticationService.signup(registerUserDto))
                .subscribeOn(Schedulers.boundedElastic()) // Required for blocking DB calls
                .onErrorMap(e -> {
                    if (e.getMessage().contains("duplicate") || e instanceof DataIntegrityViolationException) {
                        return new DuplicateKeyException("User already exists");
                    }
                    return e;
                })
                .map(ResponseEntity::ok);
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
