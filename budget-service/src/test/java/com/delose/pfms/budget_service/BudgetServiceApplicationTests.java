package com.delose.pfms.budget_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@EmbeddedKafka
@ActiveProfiles("dev")
class BudgetServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
