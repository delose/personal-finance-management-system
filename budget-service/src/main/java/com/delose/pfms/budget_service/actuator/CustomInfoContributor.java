package com.delose.pfms.budget_service.actuator;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomInfoContributor implements InfoContributor {

    private final Environment environment;

    public CustomInfoContributor(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void contribute(Info.Builder builder) {
        Map<String, Object> appDetails = new HashMap<>();
        appDetails.put("version", "2.5.0-SNAPSHOT");
        appDetails.put("status", "OPERATIONAL");
        appDetails.put("deployedAt", DateTimeFormatter.ISO_INSTANT.format(Instant.now()));

        Map<String, String> contactInfo = new HashMap<>();
        contactInfo.put("email", "delossantos.eugene@gmail.com");
        contactInfo.put("phone", "+63-9958104791");

        Map<String, Object> environmentInfo = new HashMap<>();
        String[] activeProfiles = environment.getActiveProfiles();
        if (activeProfiles.length > 0) {
            environmentInfo.put("profile", String.join(",", activeProfiles));
        } else {
            environmentInfo.put("profile", "default/not-specified");
        }

        environmentInfo.put("os", System.getProperty("os.name"));

        builder.withDetail("application", appDetails);
        builder.withDetail("contact", contactInfo);
        builder.withDetail("runtime_environment", environmentInfo);
        builder.withDetail("initialized", true);

    }
}