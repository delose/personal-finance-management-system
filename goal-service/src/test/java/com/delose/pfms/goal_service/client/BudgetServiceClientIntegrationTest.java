package com.delose.pfms.goal_service.client;

import com.delose.pfms.goal_service.service.ExternalBudgetService;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureWireMock(port = 0)
@ActiveProfiles("test")
class BudgetServiceClientIntegrationTest {

    @Autowired
    private BudgetServiceClient budgetServiceClient;

    @Autowired
    private ExternalBudgetService externalBudgetService;

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;

    private CircuitBreaker circuitBreaker;

    @BeforeEach
    void setUp() {
        circuitBreaker = circuitBreakerRegistry.circuitBreaker("budgetService");
        circuitBreaker.reset();
    }

    @AfterEach
    void tearDown() {
        WireMock.reset();
    }

    @Test
    void getBudgetById_ShouldReturnBudget_WhenExternalServiceIsUp() {
        // Arrange
        Long budgetId = 1L;
        String expectedResponse = "{\"id\":1,\"userId\":\"user1\",\"category\":\"FOOD\",\"amount\":1000.0}";

        stubFor(get(urlEqualTo("/api/budgets/1"))
                .willReturn(aResponse()
                        .withStatus(HttpStatus.OK.value())
                        .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                        .withBody(expectedResponse)));

        // Act
        BudgetResponse response = budgetServiceClient.getBudgetById(budgetId);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1000.0, response.getAmount());
        assertEquals("FOOD", response.getCategory());
    }

    @Test
    void getBudgetById_ShouldTriggerFallback_WhenExternalServiceIsDown() {
        // Arrange
        Long budgetId = 1L;

        stubFor(get(urlEqualTo("/api/budgets/1"))
                .willReturn(aResponse()
                        .withStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())));

        // Act
        BudgetResponse response = budgetServiceClient.getBudgetById(budgetId);

        // Assert
        assertNotNull(response);
        assertEquals(budgetId, response.getId());
        assertEquals(0.0, response.getAmount());
        assertEquals("DEFAULT", response.getCategory());
    }

    @Test
    void circuitBreaker_ShouldOpen_WhenMultipleFailuresOccur() {
        // Arrange
        Long budgetId = 1L;

        // Simulate 5 failures to open the circuit breaker
        for (int i = 0; i < 5; i++) {
            stubFor(get(urlEqualTo("/api/budgets/1"))
                    .willReturn(aResponse()
                            .withStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())));
            try {
                budgetServiceClient.getBudgetById(budgetId);
            } catch (Exception e) {
                // Expected
            }
        }

        // Assert circuit breaker is OPEN
        assertEquals(CircuitBreaker.State.OPEN, circuitBreaker.getState());

        // Act: Try again after circuit is open
        BudgetResponse response = budgetServiceClient.getBudgetById(budgetId);

        // Assert: Should return fallback immediately without calling external service
        assertNotNull(response);
        assertEquals(budgetId, response.getId());
        assertEquals(0.0, response.getAmount());
        assertEquals("DEFAULT", response.getCategory());
    }
}
