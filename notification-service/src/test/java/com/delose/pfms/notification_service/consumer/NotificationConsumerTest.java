package com.delose.pfms.notification_service.consumer;

import com.delose.pfms.notification_service.dto.NotificationRequest;
import com.delose.pfms.notification_service.service.NotificationService;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@DirtiesContext
@EnableKafka
@EmbeddedKafka
@ActiveProfiles("dev")
public class NotificationConsumerTest {

    @Autowired
    private KafkaTemplate<String, NotificationRequest> kafkaTemplate;

    @Autowired
    private NotificationConsumer notificationConsumer;

    @Autowired
    private NotificationService notificationService;

    private static final int MESSAGE_COUNT = 5;

    private static final String TOPIC = "notification_requests_topic";

    @Test
    void testConsumerReceivesAndProcessesMessage() throws Exception {

        NotificationService.processedMessageCount.set(0);

        for (int i = 0; i < 5; i++) {
            NotificationRequest request = new NotificationRequest(
                    "user" + i,
                    "test" + i + "@example.com",
                    "Test Subject " + i,
                    "Test Body " + i,
                    "EMAIL"
            );
            kafkaTemplate.send(TOPIC, request.getUserId(), request).get(1, TimeUnit.SECONDS);
            System.out.println("Message " + i + " sent to Kafka with message: " + request);
        }

        System.out.println("Waiting for all " + 5 + " messages to be processed...");

        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .pollInterval(200, TimeUnit.MILLISECONDS)
                .untilAsserted(() -> {
                    assertEquals(MESSAGE_COUNT, NotificationService.processedMessageCount.get(),
                            "All messages should have been processed within the timeout period.");
                });

        System.out.println("All messages successfully consumed and processed!");
    }
}
