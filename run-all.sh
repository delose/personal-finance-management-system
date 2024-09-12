#!/bin/bash

# Function to rebuild a Maven project
rebuild_service() {
    SERVICE_NAME=$1
    echo "Building $SERVICE_NAME..."
    
    # Navigate to the service directory
    cd $SERVICE_NAME
    
    # Clean and package the service
    # mvn clean package -DskipTests
    
    # Build the Docker image
    # docker build -t delose/$SERVICE_NAME:latest .

    # Run the Docker build script
    ./docker-build.sh

    # Verify jar file
    ./jar-verify.sh

    # Run the Docker run script
    ./run-docker.sh

    # Check logs
    ./logs-docker.sh
    
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
    rebuild_service $service
done

# Start the services using Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up


