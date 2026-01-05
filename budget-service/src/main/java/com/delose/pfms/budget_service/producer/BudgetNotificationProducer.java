package com.delose.pfms.budget_service.producer;

import com.delose.pfms.budget_service.dto.BudgetNotification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class BudgetNotificationProducer {
    private final KafkaTemplate<String, BudgetNotification> kafkaTemplate;
    private static final String TOPIC = "notification_requests_topic";

    public BudgetNotificationProducer(KafkaTemplate<String, BudgetNotification> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Async
    public void sendBudgetRequest(BudgetNotification request) {
        kafkaTemplate.send(TOPIC, request.getUserId(), request);
        System.out.println("Produced budget message topic: " + TOPIC);
    }
}
