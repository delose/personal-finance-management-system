#!/usr/bin/env bash

docker stop consul-server 2>/dev/null
docker rm consul-server 2>/dev/null

docker-compose up -d