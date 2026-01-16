package com.delose.pfms.goal_service.service;

import com.delose.pfms.goal_service.client.BudgetResponse;
import com.delose.pfms.goal_service.client.BudgetServiceClient;
import com.delose.pfms.goal_service.client.BudgetServiceClientFallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BudgetServiceWrapper {

    private static final Logger logger = LoggerFactory.getLogger(BudgetServiceWrapper.class);

    @Autowired
    private BudgetServiceClient budgetServiceClient;

    @Autowired
    private BudgetServiceClientFallback budgetServiceClientFallback;

    private boolean fallbackEnabled = true;

    public BudgetResponse getBudgetById(Long id) {
        if (fallbackEnabled) {
            return budgetServiceClient.getBudgetById(id);
        } else {
            // Directly call the fallback method to simulate a failure without triggering the Feign client
            // This is a workaround to test the Circuit Breaker without a real external service
            return budgetServiceClientFallback.fallbackGetBudgetById(id, new RuntimeException("Test exception"));
        }
    }

    public void setFallbackEnabled(boolean enabled) {
        this.fallbackEnabled = enabled;
    }
}
