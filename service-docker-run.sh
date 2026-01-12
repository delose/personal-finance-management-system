#!/usr/bin/env bash

# Function to rebuild a Maven project
# Assumption: Every service is down
start_service() {
    SERVICE_NAME=$1
    echo "Building $SERVICE_NAME..."

    # Navigate to the service directory
    cd $SERVICE_NAME

    # Build
    ./docker-build.sh

    # Check logs
    ./run-docker.sh

    # Navigate back to the root directory
    cd ..
}

# List of services
services=(
    "config-server"
    "discovery-server"
    "api-gateway"
    "budget-service"
    "goal-service"
    "notification-service"
    "account-service"
    "transaction-service"
)

# Loop through each service and rebuild it
for service in "${services[@]}"
do
    start_service $service
done


