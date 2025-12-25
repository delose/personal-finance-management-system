#!/bin/bash

docker stop goal-service 2>/dev/null
docker rm goal-service 2>/dev/null

# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.

docker run -d -p 8084:8084 --name goal-service \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  delose/goal-service:latest


