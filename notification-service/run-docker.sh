#!/bin/bash

docker stop notification-service 2>/dev/null
docker rm notification-service 2>/dev/null
# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.

docker run -d -p 8085:8085 --name notification-service \
  --network pfms-network \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e CONSUL_HOST=host.docker.internal \
  -e CONSUL_PORT=8500 \
  -e SPRING_KAFKA_CONSUMER_VALUE_DESERIALIZER="org.springframework.kafka.support.serializer.ErrorHandlingDeserializer" \
  -e SPRING_KAFKA_CONSUMER_PROPERTIES_SPRING_DESERIALIZER_VALUE_DELEGATE_CLASS="org.springframework.kafka.support.serializer.JsonDeserializer" \
  -e SPRING_KAFKA_CONSUMER_PROPERTIES_SPRING_JSON_TRUSTED_PACKAGES="*" \
  -e SPRING_KAFKA_CONSUMER_PROPERTIES_SPRING_JSON_USE_TYPE_HEADERS="false" \
  -e SPRING_KAFKA_CONSUMER_PROPERTIES_SPRING_JSON_VALUE_DEFAULT_TYPE="com.delose.pfms.notification_service.dto.NotificationRequest" \
  delose/notification-service:latest


