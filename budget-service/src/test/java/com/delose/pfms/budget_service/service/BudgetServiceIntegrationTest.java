package com.delose.pfms.budget_service.service;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class BudgetServiceIntegrationTest {

    @Autowired
    private BudgetService budgetService;

    @SpyBean
    private BudgetRepository budgetRepository;

    @BeforeEach
    void setup() {
        Budget dummyB = new Budget();
        dummyB.setId(1L);
        budgetService.saveBudget(dummyB);
    }

    @Test
    void testCache() {
        Long budgetId = 1L;

        long start1 = System.currentTimeMillis();
        Budget b1 = budgetService.findBudgetById(budgetId).orElseGet(null);
        long end1 = System.currentTimeMillis();

        verify(budgetRepository, times(1)).findById(budgetId);
        System.out.println("First call time: " + (end1 - start1) + "ms");

        long start2 = System.currentTimeMillis();
        Budget b2 = budgetService.findBudgetById(budgetId).orElseGet(null);
        long end2 = System.currentTimeMillis();

        long secondCallTime = end2 - start2;
        verify(budgetRepository, times(1)).findById(budgetId);
        System.out.println("Second call time: " + secondCallTime + "ms");

        assertEquals(b1, b2);
        assertThat(secondCallTime).isLessThan(10);
    }
}
