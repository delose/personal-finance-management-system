#!/bin/bash

docker stop reporting-service 2>/dev/null
docker rm reporting-service 2>/dev/null

./docker-build.sh

docker run -d \
  --name reporting-service \
  --network pfms-network \
  -p 8086:8000 \
  -e CONSUL_HOST=host.docker.internal \
  -e CONSUL_PORT=8500 \
  reporting-service

