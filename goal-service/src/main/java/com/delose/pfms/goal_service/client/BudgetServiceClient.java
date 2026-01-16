package com.delose.pfms.goal_service.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "budget-service", url = "${external.budget-service.url}", fallback = BudgetServiceClientFallback.class)
public interface BudgetServiceClient {

    @GetMapping("/api/budgets/{id}")
    @CircuitBreaker(name = "budgetService")
    @Retry(name = "budgetService")
    BudgetResponse getBudgetById(@PathVariable("id") Long id);
}
