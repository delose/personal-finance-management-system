package com.delose.pfms.budget_service.service;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    private static final Logger log = LoggerFactory.getLogger(BudgetService.class);


    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> findAllBudgets() {
        return this.budgetRepository.findAll();
    }

    public Budget saveBudget(Budget budget) {
        return this.budgetRepository.save(budget);
    }

    @Cacheable(value = "budgets")
    public Optional<Budget> findBudgetById(Long id) {
        long start = System.currentTimeMillis();
        Optional<Budget> b = this.budgetRepository.findById(id);
        log.info("Cache MISS - ID: {} | Execution: {}ms", id, (System.currentTimeMillis() - start));
        return b;
    }
}
