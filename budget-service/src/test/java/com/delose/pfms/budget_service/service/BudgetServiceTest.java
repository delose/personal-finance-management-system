package com.delose.pfms.budget_service.service;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.entity.BudgetCategory;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private BudgetService budgetService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void whenFindAll_thenReturnAllBudgets() {
        Budget b1 = new Budget();
        b1.setId(1L);
        b1.setAmount(BigDecimal.ONE);
        b1.setCategory(BudgetCategory.FOOD);

        Budget b2 = new Budget();
        b2.setId(2L);
        b2.setAmount(BigDecimal.valueOf(20.43));
        b2.setCategory(BudgetCategory.RENT);

        when(budgetRepository.findAll()).thenReturn(Arrays.asList(b1, b2));

        List<Budget> budgets = this.budgetService.findAllBudgets();

        assertEquals(2, budgets.size());
        assertEquals(BudgetCategory.FOOD, budgets.get(0).getCategory());
        verify(budgetRepository, times(1)).findAll();

    }


}
