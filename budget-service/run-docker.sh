#!/bin/bash

# Stop and remove existing container if it exists
docker stop budget-service 2>/dev/null
docker rm budget-service 2>/dev/null

# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.
# NOTE: The application runs on port 8082 inside the container (see application.yml)

docker run -d -p 8082:8082 --name budget-service \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  delose/budget-service:latest


