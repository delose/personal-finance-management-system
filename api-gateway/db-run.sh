#!/usr/bin/env bash

docker stop apigwdb 2>/dev/null
docker rm apigwdb 2>/dev/null

docker run -d \
  --name apigwdb \
  --restart unless-stopped \
  -v apigw_data:/var/lib/mysql \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=apigwdb \
  mysql:8.0
