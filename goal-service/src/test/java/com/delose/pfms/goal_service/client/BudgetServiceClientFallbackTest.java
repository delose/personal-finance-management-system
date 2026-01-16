package com.delose.pfms.goal_service.client;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceClientFallbackTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @InjectMocks
    private BudgetServiceClientFallback fallback;

    @Test
    void getBudgetById_ShouldReturnDefault_WhenRedisIsNotAvailable() {
        // Arrange
        Long budgetId = 1L;

        // Act
        BudgetResponse actualResponse = fallback.getBudgetById(budgetId);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(budgetId, actualResponse.getId());
        assertEquals(0.0, actualResponse.getAmount());
        assertEquals("DEFAULT", actualResponse.getCategory());
    }

    @Test
    void getBudgetById_ShouldReturnCachedBudget_WhenRedisHasData() {
        // Arrange
        Long budgetId = 1L;
        BudgetResponse cachedResponse = new BudgetResponse();
        cachedResponse.setId(budgetId);
        cachedResponse.setAmount(500.0);
        cachedResponse.setCategory("CACHED");

        ValueOperations<String, Object> valueOps = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get("budget:" + budgetId)).thenReturn(cachedResponse);

        // Act
        BudgetResponse actualResponse = fallback.getBudgetById(budgetId);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(budgetId, actualResponse.getId());
        assertEquals(500.0, actualResponse.getAmount());
        assertEquals("CACHED", actualResponse.getCategory());
        verify(valueOps, times(1)).get("budget:" + budgetId);
    }
}
