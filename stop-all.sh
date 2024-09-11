#!/bin/bash

# Function to rebuild a Maven project
stop_service() {
    SERVICE_NAME=$1
    echo "Stopping $SERVICE_NAME..."
    
    # Navigate to the service directory
    cd $SERVICE_NAME
    
    # Stop Docker
    ./stop-remote-docker.sh   
 
    # Navigate back to the root directory
    cd ..
}

# List of services
services=(
    "config-server"
    "discovery-server"
    "api-gateway"
    "user-service"
    "budget-service"
    "expense-service"
    "goal-service"
    "notification-service"
    "reporting-service"
    "messaging-service"
)

# Loop through each service and rebuild it
for service in "${services[@]}"
do
    stop_service $service
done

# Start the services using Docker Compose
echo "Stopped services with Docker Compose..."


