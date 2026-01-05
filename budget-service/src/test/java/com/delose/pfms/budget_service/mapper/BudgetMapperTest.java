package com.delose.pfms.budget_service.mapper;

import com.delose.pfms.budget_service.dto.BudgetNotification;
import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.entity.BudgetCategory;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

class BudgetMapperTest {

    // Instantiate the generated implementation manually for the unit test
    private final BudgetMapper mapper = Mappers.getMapper(BudgetMapper.class);

    @Test
    void shouldMapBudgetToBudgetNotification() {
        // GIVEN
        Budget budget = new Budget();
        budget.setId(101L);
        budget.setUserId("user_abc");
        budget.setCategory(BudgetCategory.ENTERTAINMENT);

        // WHEN
        BudgetNotification result = mapper.toNotification(budget);

        // THEN
        assertNotNull(result);
        assertEquals(101L, result.getId());
        assertEquals("user_abc", result.getUserId());

        // Test Constants
        assertEquals("Producer Test", result.getSubject());
        assertEquals("SMS", result.getChannel());

        // Test Expression
        assertEquals("Budget created for category: ENTERTAINMENT", result.getMessageBody());
    }

    @Test
    void shouldHandleNullBudget() {
        // WHEN
        BudgetNotification result = mapper.toNotification(null);

        // THEN
        assertNull(result);
    }
}
