package com.delose.pfms.goal_service.service;

import com.delose.pfms.goal_service.client.BudgetResponse;
import com.delose.pfms.goal_service.client.BudgetServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExternalBudgetService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalBudgetService.class);

    @Autowired
    private BudgetServiceClient budgetServiceClient;

    @CircuitBreaker(name = "budgetService", fallbackMethod = "fallbackBudget")
    @Retry(name = "budgetService")
    public BudgetResponse getBudgetById(Long id) {
        logger.info("Calling budget service for id: {}", id);
        return budgetServiceClient.getBudgetById(id);
    }

    // Fallback method (will be called by the Feign client fallback, but we can also define it here for direct use)
    public BudgetResponse fallbackBudget(Long id, Throwable t) {
        logger.warn("Fallback triggered in ExternalBudgetService for id: {}, error: {}", id, t.getMessage());
        // This method is not strictly needed if using Feign fallback, but kept for clarity.
        // The actual fallback logic is in BudgetServiceClientFallback.
        return null;
    }
}
