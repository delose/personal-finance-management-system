#!/bin/bash

# 1. Stop and remove existing container
docker stop api-gateway 2>/dev/null
docker rm api-gateway 2>/dev/null

# 2. Run the container
# We use --add-host to ensure host.docker.internal resolves correctly
# We use SPRING_PROFILES_ACTIVE=docker to trigger application-docker.properties
docker run -d -p 8080:8080 --name api-gateway \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL='jdbc:mysql://host.docker.internal:3307/apigwdb?serverTimezone=UTC&allowPublicKeyRetrieval=true&useSSL=false' \
  -e SPRING_DATASOURCE_USERNAME='root' \
  -e SPRING_DATASOURCE_PASSWORD='secret' \
  delose/api-gateway:latest
