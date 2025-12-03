package com.delose.pfms.notification_service.consumer;

import com.delose.pfms.notification_service.dto.NotificationRequest;
import com.delose.pfms.notification_service.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {
    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "notification_requests_topic", groupId = "notification-service-group")
    public void listen(NotificationRequest request) {
        System.out.println("Received message in consumer: " + request);
        notificationService.sendNotificationAsync(request);
    }
}
