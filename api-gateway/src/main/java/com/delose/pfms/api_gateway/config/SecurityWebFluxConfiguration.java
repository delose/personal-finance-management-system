package com.delose.pfms.api_gateway.config;

import com.delose.pfms.api_gateway.exception.ReactiveGlobalExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.reactive.function.server.HandlerStrategies;

import java.util.List;

import static org.springframework.security.config.web.server.SecurityWebFiltersOrder.AUTHENTICATION;

@Configuration
@EnableWebFluxSecurity
public class SecurityWebFluxConfiguration {
    private final CustomReactiveAuthenticationManager customReactiveAuthenticationManager;
    private final ServerJwtAuthenticationConverter serverJwtAuthenticationConverter;
    private final ReactiveGlobalExceptionHandler exceptionHandler;

    public SecurityWebFluxConfiguration(
            CustomReactiveAuthenticationManager customReactiveAuthenticationManager,
            ServerJwtAuthenticationConverter serverJwtAuthenticationConverter,
            ReactiveGlobalExceptionHandler exceptionHandler) {
        this.customReactiveAuthenticationManager = customReactiveAuthenticationManager;
        this.serverJwtAuthenticationConverter = serverJwtAuthenticationConverter;
        this.exceptionHandler = exceptionHandler;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) {
        AuthenticationWebFilter authenticationWebFilter = new AuthenticationWebFilter(customReactiveAuthenticationManager);
        authenticationWebFilter.setServerAuthenticationConverter(serverJwtAuthenticationConverter);

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/auth/**", "/dashboard", "/actuator").permitAll()
                        .anyExchange().authenticated()
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((exchange, ex) -> {
                            return exceptionHandler.handle(exchange, ex);
                        })
                        .accessDeniedHandler((exchange, ex) -> {
                            return exceptionHandler.handle(exchange, ex);
                        })
                )
                .addFilterAt(authenticationWebFilter, AUTHENTICATION);
        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8005"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8005"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public HandlerStrategies handlerStrategies() {
        return HandlerStrategies.withDefaults();
    }
}
