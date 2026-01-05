package com.delose.pfms.notification_service.producer;

import com.delose.pfms.notification_service.dto.NotificationRequest;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@EmbeddedKafka
@SpringBootTest
@DirtiesContext
@ActiveProfiles("dev")
public class NotificationProducerTest {

    @Autowired
    private NotificationProducer notificationProducer;

    @Autowired
    private EmbeddedKafkaBroker embeddedKafkaBroker;

    private Consumer<String, NotificationRequest> consumer;
    private static final String TOPIC = "notification_requests_topic";

    @BeforeEach
    void setUp() {
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps("test-group", "true", embeddedKafkaBroker);

        consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        consumerProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        DefaultKafkaConsumerFactory<String, NotificationRequest> cf = new DefaultKafkaConsumerFactory<>(consumerProps);
        consumer = cf.createConsumer();
        consumer.subscribe(Collections.singleton(TOPIC));
    }

    @AfterEach
    void tearDown() {
        if (consumer != null) {
            consumer.close();
        }
    }

    @Test
    void testSendNotificationRequest_sendsMessageToKafkaTopic() throws Exception {
        NotificationRequest testRequest = new NotificationRequest(
                1L,
                "producer@example.com",
                "Producer Test",
                "This is a test message from the producer test.",
                "SMS"
        );

        notificationProducer.sendNotificationRequest(testRequest);

        ConsumerRecord<String, NotificationRequest> receivedRecord =
                KafkaTestUtils.getSingleRecord(consumer, TOPIC);

        assertNotNull(receivedRecord, "A message should have been received by the test consumer.");
        assertEquals(testRequest.getUserId(), receivedRecord.key(), "Message key should match the userId.");
        assertEquals(testRequest.getSubject(), receivedRecord.value().getSubject(), "Recipient should match the sent request.");
        assertEquals(testRequest.getMessageBody(), receivedRecord.value().getMessageBody(), "Message body should match the sent request.");
    }
}