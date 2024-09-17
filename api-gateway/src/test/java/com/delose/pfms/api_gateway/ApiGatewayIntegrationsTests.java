package com.delose.pfms.api_gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.junit.jupiter.api.Disabled;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Disabled
class ApiGatewayIntegrationTests {

    @LocalServerPort
    private int port;

    @Test
    void testUserServiceRouting() {
        String url = "http://localhost:" + port + "/users/test";  // Adjust the path to match a user service route

        HttpHeaders headers = new HttpHeaders();
        String auth = "pfms:pfms"; // Replace with your actual username and password
        headers.set("Authorization", "Basic " + java.util.Base64.getEncoder().encodeToString(auth.getBytes()));

        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        assertThat(response.getStatusCode().value()).isEqualTo(200);
    }
    @Test
    void testBudgetServiceRouting() {
        String url = "http://localhost:" + port + "/budgets/test";  // Adjust the path to match a budget service route

        HttpHeaders headers = new HttpHeaders();
        String auth = "pfms:pfms"; // Replace with your actual username and password
        headers.set("Authorization", "Basic " + java.util.Base64.getEncoder().encodeToString(auth.getBytes()));

        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        assertThat(response.getStatusCode().value()).isEqualTo(200);
    }}