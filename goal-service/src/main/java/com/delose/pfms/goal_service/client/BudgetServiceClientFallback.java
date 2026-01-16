package com.delose.pfms.goal_service.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class BudgetServiceClientFallback implements BudgetServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(BudgetServiceClientFallback.class);

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public BudgetResponse getBudgetById(Long id) {
        // This method is not used by Resilience4j, but is required by the FeignClient interface.
        // The actual fallback logic is in the fallbackGetBudgetById method.
        return fallbackGetBudgetById(id, new RuntimeException("Feign fallback triggered"));
    }

    // Correct fallback method signature
    public BudgetResponse fallbackGetBudgetById(Long id, Throwable t) {
        logger.warn("Fallback triggered for getBudgetById, id: {}, error: {}", id, t.getMessage());

        // Try to get from Redis cache
        if (redisTemplate != null) {
            try {
                BudgetResponse cached = (BudgetResponse) redisTemplate.opsForValue().get("budget:" + id);
                if (cached != null) {
                    logger.info("Returning cached budget from Redis for id: {}", id);
                    return cached;
                }
            } catch (Exception e) {
                logger.error("Error accessing Redis cache: {}", e.getMessage());
            }
        }

        // Return a sensible default
        logger.info("Returning default budget for id: {}", id);
        BudgetResponse defaultBudget = new BudgetResponse();
        defaultBudget.setId(id);
        defaultBudget.setAmount(0.0);
        defaultBudget.setCategory("DEFAULT");
        return defaultBudget;
    }
}
