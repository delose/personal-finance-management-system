package com.delose.pfms.goal_service.service;

import com.delose.pfms.goal_service.client.BudgetResponse;
import com.delose.pfms.goal_service.client.BudgetServiceClient;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExternalBudgetServiceTest {
    @Mock
    private BudgetServiceClient budgetServiceClient;

    @InjectMocks
    private ExternalBudgetService externalBudgetService;

    @Test
    void getBudgetById_ShouldReturnBudget_WhenClientSucceeds() {
        // Arrange
        Long budgetId = 1L;
        BudgetResponse expectedResponse = new BudgetResponse();
        expectedResponse.setId(budgetId);
        expectedResponse.setAmount(1000.0);
        expectedResponse.setCategory("FOOD");

        when(budgetServiceClient.getBudgetById(budgetId)).thenReturn(expectedResponse);

        // Act
        BudgetResponse actualResponse = externalBudgetService.getBudgetById(budgetId);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(budgetId, actualResponse.getId());
        assertEquals(1000.0, actualResponse.getAmount());
        assertEquals("FOOD", actualResponse.getCategory());
        verify(budgetServiceClient, times(1)).getBudgetById(budgetId);
    }
}
