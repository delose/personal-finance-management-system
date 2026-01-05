package com.delose.pfms.budget_service.controller;

import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.entity.BudgetCategory;
import com.delose.pfms.budget_service.producer.BudgetNotificationProducer;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest()
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1, brokerProperties = { "listeners=PLAINTEXT://localhost:9092", "port=9092" })
@DirtiesContext
public class BudgetControllerV1Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BudgetRepository budgetRepository;

    @MockBean
    private BudgetNotificationProducer producer;

    @BeforeEach
    void setup() {
        budgetRepository.deleteAll();
    }

    @Test
    void whenPostBudget_thenStatusCreatedAndBudgetReturned() throws Exception {
        Budget newBudget = new Budget();
        newBudget.setId(1L);
        newBudget.setUserId("1L");
        newBudget.setCategory(BudgetCategory.ENTERTAINMENT);
        newBudget.setAmount(BigDecimal.ZERO);

        mockMvc.perform(post("/v1/api/budgets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBudget)))
                .andDo(print()) // ADDED THIS LINE TO SEE THE ERROR
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.category", is(BudgetCategory.ENTERTAINMENT.toString())))
                .andExpect(jsonPath("$.amount", is(BigDecimal.ZERO.intValue())));

        verify(producer, times(1)).sendBudgetRequest(any());

    }

}
