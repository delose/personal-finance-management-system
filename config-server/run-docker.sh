#!/bin/bash

docker stop config-server 2>/dev/null
docker rm config-server 2>/dev/null

docker run -d -p 8888:8888 --name config-server \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  delose/config-server:latest


