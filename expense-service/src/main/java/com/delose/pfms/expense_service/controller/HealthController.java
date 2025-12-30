package com.delose.pfms.expense_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/expense-health-check")
    public ResponseEntity<String> myCustomCheck() {
        String message = "Testing expense service health check";
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
