#!/usr/bin/env bash
echo "Starting build via docker compose for analytics-service..."

# Build the specific service image as defined in docker-compose.yml
docker compose build analytics-service

if [ $? -eq 0 ]; then
    echo "Build successful: analytics-service image is ready."
else
    echo "Build failed!"
    exit 1
fi
