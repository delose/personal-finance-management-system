#!/bin/bash

docker stop discovery-server 2>/dev/null
docker rm discovery-server 2>/dev/null

docker run -d -p 8761:8761 --name discovery-server \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  delose/discovery-server:latest


