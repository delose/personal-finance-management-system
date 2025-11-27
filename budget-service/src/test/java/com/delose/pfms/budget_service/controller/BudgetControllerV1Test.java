package com.delose.pfms.budget_service.controller;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.entity.BudgetCategory;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BudgetControllerV1Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BudgetRepository budgetRepository;

    @BeforeEach
    void setup() {
        budgetRepository.deleteAll();
    }

    @Test
    void whenPostBudget_thenStatusCreatedAndBudgetReturned() throws Exception {
        Budget newBudget = new Budget();
        newBudget.setId(1L);
        newBudget.setCategory(BudgetCategory.ENTERTAINMENT);
        newBudget.setAmount(BigDecimal.ZERO);

        mockMvc.perform(post("/v1/api/budgets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBudget)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.category", is(BudgetCategory.ENTERTAINMENT.toString())))
                .andExpect(jsonPath("$.amount", is(BigDecimal.ZERO.intValue())));

    }

}
