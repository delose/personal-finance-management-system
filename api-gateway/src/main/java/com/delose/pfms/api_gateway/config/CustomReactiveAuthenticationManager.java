package com.delose.pfms.api_gateway.config;

import com.delose.pfms.api_gateway.service.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class CustomReactiveAuthenticationManager implements ReactiveAuthenticationManager {

    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public CustomReactiveAuthenticationManager(UserDetailsService userDetailsService, JwtService jwtService) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String userEmail = authentication.getName();
        String jwt = (String) authentication.getCredentials();

        return Mono.fromCallable(() -> {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            if (userDetails != null && jwtService.isTokenValid(jwt, userDetails)) {
                return (Authentication) new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
            } else {
                throw new BadCredentialsException("Invalid token or user details.");
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}