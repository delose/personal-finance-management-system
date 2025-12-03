package com.delose.pfms.notification_service.service;

import com.delose.pfms.notification_service.dto.NotificationRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class NotificationService {

    public static AtomicInteger processedMessageCount = new AtomicInteger(0);

    @Async
    public void sendNotificationAsync(NotificationRequest request) {
        System.out.println("Processing notification asynchronously for user: " + request);

        try {
            Thread.sleep(500);
            processedMessageCount.incrementAndGet();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
