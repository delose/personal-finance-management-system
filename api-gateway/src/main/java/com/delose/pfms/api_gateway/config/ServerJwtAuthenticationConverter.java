package com.delose.pfms.api_gateway.config;

import com.delose.pfms.api_gateway.service.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class ServerJwtAuthenticationConverter implements ServerAuthenticationConverter {

    private final JwtService jwtService;

    public ServerJwtAuthenticationConverter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        return Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                .filter(authHeader -> authHeader.startsWith("Bearer "))
                .map(authHeader -> authHeader.substring(7))
                .flatMap(jwt -> {
                    String userEmail = jwtService.extractUsername(jwt);
                    if (userEmail == null) {
                        return Mono.empty();
                    }
                    return Mono.just(new UsernamePasswordAuthenticationToken(userEmail, jwt, null));
                });
    }
}