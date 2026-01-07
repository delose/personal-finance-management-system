#!/bin/bash

# 0. Start up DB
./db-run.sh

# 1. Stop and remove existing container
docker stop api-gateway 2>/dev/null
docker rm api-gateway 2>/dev/null

# 2. Run the container
# We use --add-host to ensure host.docker.internal resolves correctly
# We use SPRING_PROFILES_ACTIVE=docker to trigger application-docker.properties
docker run -d -p 8080:8080 --name api-gateway \
  --network pfms-network \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  -e EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE="host.docker.internal" \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL='jdbc:mysql://host.docker.internal:3307/apigwdb?serverTimezone=UTC&allowPublicKeyRetrieval=true&useSSL=false' \
  -e SPRING_DATASOURCE_USERNAME='root' \
  -e SPRING_DATASOURCE_PASSWORD='secret' \
  delose/api-gateway:latest
