package com.delose.pfms.discovery_server.controller;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController implements HealthIndicator {

    @Override
    public Health health() {
        // Add any custom health checks here
        return Health.up().withDetail("service", "discovery-server").build();
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Discovery Server is healthy";
    }
}
