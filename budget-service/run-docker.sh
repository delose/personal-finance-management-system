#!/bin/bash

# Stop and remove existing container if it exists
docker stop budget-service 2>/dev/null
docker rm budget-service 2>/dev/null

# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.
# NOTE: The application runs on port 8082 inside the container (see application.yml)

docker run -d -p 8082:8082 --name budget-service \
  --network pfms-network \
  -e EUREKA_INSTANCE_HOSTNAME=budget-service \
  -e EUREKA_INSTANCE_PREFER_IP_ADDRESS=false \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS="global-service-kafka:29092" \
  -e SPRING_KAFKA_PRODUCER_VALUE_SERIALIZER="org.springframework.kafka.support.serializer.JsonSerializer" \
  delose/budget-service:latest



