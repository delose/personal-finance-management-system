#!/bin/bash

docker stop expense-service 2>/dev/null
docker rm expense-service 2>/dev/null
# •	-p <host_port>:<container_port>:
# •	<host_port> is the port on your host machine (i.e., your MacBook) that you want to map.
# •	<container_port> is the port that the application is listening on inside the Docker container.

docker run -d -p 8083:8083 --name expense-service \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e CONSUL_HOST=host.docker.internal \
  -e CONSUL_PORT=8500 \
  delose/expense-service:latest


