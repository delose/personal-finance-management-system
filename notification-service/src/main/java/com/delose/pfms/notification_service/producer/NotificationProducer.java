package com.delose.pfms.notification_service.producer;

import com.delose.pfms.notification_service.dto.NotificationRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationProducer {
    private final KafkaTemplate<String, NotificationRequest> kafkaTemplate;
    private static final String TOPIC = "notification_requests_topic";

    public NotificationProducer(KafkaTemplate<String, NotificationRequest> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendNotificationRequest(NotificationRequest request) {
        kafkaTemplate.send(TOPIC, request.getUserId(), request);
        System.out.println("Produced message topic: " + TOPIC);
    }
}
