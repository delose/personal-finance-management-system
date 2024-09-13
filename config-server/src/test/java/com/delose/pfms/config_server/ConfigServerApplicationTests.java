package com.delose.pfms.config_server;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Base64Utils;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ConfigServerApplicationTests {

    @LocalServerPort
    private int port;

    @Test
    void contextLoads() {
        // Basic test to ensure the application context loads
    }

    @Test
    void configServerIsUp() {
        String url = "http://localhost:" + port + "/actuator/health";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        assertThat(response.getBody()).contains("\"status\":\"UP\"");
    }

    @Test
    void fetchConfigProperties() {
        String url = "http://localhost:" + port + "/config-client/default";

        HttpHeaders headers = new HttpHeaders();
        String auth = "pfms:pfms"; // Replace with your actual username and password
        headers.set("Authorization", "Basic " + Base64Utils.encodeToString(auth.getBytes()));

        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).contains("propertySources"); // Adjust based on actual properties
    }}
