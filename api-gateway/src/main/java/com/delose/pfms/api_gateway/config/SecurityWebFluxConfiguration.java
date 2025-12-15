package com.delose.pfms.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

@Configuration
@EnableWebFluxSecurity
public class SecurityWebFluxConfiguration {
    private final CustomReactiveAuthenticationManager customReactiveAuthenticationManager;
    private final ServerJwtAuthenticationConverter serverJwtAuthenticationConverter;

    public SecurityWebFluxConfiguration(
            CustomReactiveAuthenticationManager customReactiveAuthenticationManager,
            ServerJwtAuthenticationConverter serverJwtAuthenticationConverter) {
        this.customReactiveAuthenticationManager = customReactiveAuthenticationManager;
        this.serverJwtAuthenticationConverter = serverJwtAuthenticationConverter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) {

        AuthenticationWebFilter authenticationWebFilter = new AuthenticationWebFilter(customReactiveAuthenticationManager);
        authenticationWebFilter.setServerAuthenticationConverter(serverJwtAuthenticationConverter);

        http
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/auth/**").permitAll()
                        .anyExchange().authenticated()
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)

        ;
        return http.build();
    }

}
