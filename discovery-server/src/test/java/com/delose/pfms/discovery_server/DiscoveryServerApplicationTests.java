package com.delose.pfms.discovery_server;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DiscoveryServerApplicationTests {
    @LocalServerPort
    private int port;

    @Test
    void contextLoads() {
        // This test checks if the application context loads correctly.
    }

    @Test
    void eurekaServerIsUp() {
        String url = "http://localhost:" + port + "/eureka/apps";
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        assertThat(response).contains("applications");
    }
}
