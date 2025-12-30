package com.delose.pfms.notification_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/notif-health-check")
    public ResponseEntity<String> myCustomCheck() {
        String message = "Testing notif service health check";
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
