#!/bin/bash

# Function to rebuild a Maven project
restart_service() {
    SERVICE_NAME=$1
    echo "Building $SERVICE_NAME..."
    
    # Navigate to the service directory
    cd $SERVICE_NAME

    # Build
    ./docker-build.sh

    # Run the Docker build script
    ./stop-remote-docker.sh

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
    "message-broker"
    "user-service"
    "budget-service"
    "expense-service"
    "goal-service"
    "notification-service"
    "reporting-service"
)

# Loop through each service and rebuild it
for service in "${services[@]}"
do
    restart_service $service
done

# Start the services using Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up


