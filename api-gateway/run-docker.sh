#!/bin/bash

docker run -d -p 8080:8080 --name api-gateway delose/api-gateway:latest \
  -e SPRING_DATASOURCE_URL='jdbc:mysql://host.docker.internal:3307/apigwdb?serverTimezone=UTC&allowPublicKeyRetrieval=true&useSSL=false' \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=secret

