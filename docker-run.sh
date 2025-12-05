#!/bin/bash

# Function to check if Docker is running
check_docker_running() {
    if ! docker info &> /dev/null; then
        echo "Error: Docker daemon is not running."
        echo "Please start Docker and run the script again."
        # Optional: Add specific run command for your OS if needed, e.g., 'open -a Docker' on macOS
        # For Linux, it might be 'sudo systemctl start docker' if not started at boot
        exit 1
    fi
}

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

# --- Main execution starts here ---

# 1. Check if Docker is running before doing anything else
check_docker_running

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


