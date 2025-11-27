package com.delose.pfms.budget_service.repository;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.entity.BudgetCategory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class BudgetRepositoryTest {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void whenFindAllBudget_thenReturnAllBudgets() {
        // Given
        Budget newBudget = new Budget();
        newBudget.setCategory(BudgetCategory.DINING);
        newBudget.setId(99L);

        Budget savedBudget = budgetRepository.save(newBudget);
        entityManager.flush();
        entityManager.clear();

        // When
        Optional<Budget> foundBudget = budgetRepository.findById(savedBudget.getId());

        // Then
        assertTrue(foundBudget.isPresent());
        assertEquals(BudgetCategory.DINING, foundBudget.get().getCategory());

    }
}
