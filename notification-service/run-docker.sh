#!/bin/bash

docker stop notification-service 2>/dev/null
docker rm notification-service 2>/dev/null
# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.

docker run -d -p 8085:8085 --name notification-service \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e CONSUL_HOST=host.docker.internal \
  -e CONSUL_PORT=8500 \
  -e spring.kafka.bootstrap-servers="global-service-kafka:29092" \
  -e spring.kafka.producer.value-serializer="org.springframework.kafka.support.serializer.JsonSerializer" \
  delose/notification-service:latest


