package com.delose.pfms.user_service.contoller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTests {

    @LocalServerPort
    private int port;

    @Value("${spring.security.user.name}")
    private String username;

    @Value("${spring.security.user.password}")
    private String password;

    @Test
    void testUserServiceEndpoint() {
        WebClient webClient = WebClient.builder()
                                       .baseUrl("http://localhost:" + port)
                                       .defaultHeaders(headers -> headers.setBasicAuth(username, password))
                                       .build();

        String response = webClient.get()
                                   .uri("/users/test")
                                   .retrieve()
                                   .bodyToMono(String.class)
                                   .block();

        assertThat(response).isEqualTo("User Service is up and running!");
    }

    @Test
    void testUnauthorizedAccess() {
        WebClient webClient = WebClient.builder()
                                       .baseUrl("http://localhost:" + port)
                                       .build();

        assertThrows(WebClientResponseException.Unauthorized.class, () -> {
            webClient.get()
                     .uri("/users/test")
                     .retrieve()
                     .bodyToMono(String.class)
                     .block();
        });
    }
}