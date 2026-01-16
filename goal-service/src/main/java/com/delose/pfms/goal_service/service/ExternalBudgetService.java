package com.delose.pfms.goal_service.service;

import com.delose.pfms.goal_service.client.BudgetResponse;
import com.delose.pfms.goal_service.client.BudgetServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExternalBudgetService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalBudgetService.class);

    @Autowired
    private BudgetServiceClient budgetServiceClient;

    public BudgetResponse getBudgetById(Long id) {
        logger.info("Calling budget service for id: {}", id);
        return budgetServiceClient.getBudgetById(id);
    }
}
