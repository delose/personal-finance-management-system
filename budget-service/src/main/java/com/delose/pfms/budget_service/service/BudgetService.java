package com.delose.pfms.budget_service.service;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> findAllBudgets() {
        return this.budgetRepository.findAll();
    }

    public Budget saveBudget(Budget budget) {
        return this.budgetRepository.save(budget);
    }
}
