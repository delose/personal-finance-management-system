package com.delose.pfms.budget_service.controller;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/budgets")
public class BudgetControllerV1 {

    private final BudgetService budgetService;

    public BudgetControllerV1(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public List<Budget> getAllBudgets() {
        return this.budgetService.findAllBudgets();
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        Budget savedBudget = this.budgetService.saveBudget(budget);
        return ResponseEntity.ok(budget);
    }
}
