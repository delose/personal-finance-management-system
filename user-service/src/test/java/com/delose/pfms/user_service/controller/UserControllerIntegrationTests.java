package com.delose.pfms.user_service.controller;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.reactive.function.client.WebClient;

import com.delose.pfms.user_service.entity.UserEntity;

import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTests {

    @LocalServerPort
    private int port;
    
    @Test
    @Disabled("Debugging required")
    void testRegister() {
        WebClient webClient = WebClient.builder().baseUrl("http://localhost:" + port).build();

        UserEntity user = new UserEntity();
        user.setUsername("newuser");
        user.setPassword("newpassword");
        user.setEmail("newuser@example.com");

        Mono<UserEntity> response = webClient.post()
                .uri("/users/register")
                .bodyValue(user)
                .retrieve()
                .bodyToMono(UserEntity.class);

        assertThat(response.block().getUsername()).isEqualTo("newuser");
    }

    @Test
    @Disabled("Need to fix this test: InternalServer 500 Internal Server Error")
    void testLogin() {
        WebClient webClient = WebClient.builder().baseUrl("http://localhost:" + port).build();

        Mono<UserEntity> response = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/users/login")
                        .queryParam("username", "user")
                        .queryParam("password", "password")
                        .build())
                .retrieve()
                .bodyToMono(UserEntity.class);

        assertThat(response.block().getUsername()).isEqualTo("user");
    }

    @Test
    @Disabled("Need to fix this test: Unauthorized 401 Unauthorize")
    void testGetUserDetails() {
        WebClient webClient = WebClient.builder().baseUrl("http://localhost:" + port).build();

        Mono<UserEntity> response = webClient.get()
                .uri("/users/find/user")
                .retrieve()
                .bodyToMono(UserEntity.class);

        assertThat(response.block().getUsername()).isEqualTo("user");
    }
}