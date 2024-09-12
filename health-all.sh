#!/bin/bash

# Define an array of service names
services=(
    "Config Server"
    "Discovery Server"
    "API Gateway"
    "Message Broker"
    "User Service"
    "Budget Service"
    "Expense Service"
    "Goal Service"
    "Notification Service"
    "Reporting Service"
)

# Define an array of service URLs
urls=(
    "http://localhost:8888/actuator/health"
    "http://localhost:8761/actuator/health"
    "http://localhost:8080/actuator/health"
    "http://localhost:8087/actuator/health"
    "http://localhost:8081/actuator/health"
    "http://localhost:8082/actuator/health"
    "http://localhost:8083/actuator/health"
    "http://localhost:8084/actuator/health"
    "http://localhost:8085/actuator/health"
    "http://localhost:8086/actuator/health"
)

# Function to check health status of each service
check_health() {
    local service_name=$1
    local url=$2

    # Send a GET request to the health endpoint
    response=$(curl -s $url)
    
    # Check if the response contains "UP"
    if echo "$response" | grep -q '"status":"UP"'; then
        echo "$service_name is UP"
    else
        echo "$service_name is DOWN or UNREACHABLE"
    fi
}

# Loop through each service and check its health
for i in "${!services[@]}"; do
    check_health "${services[$i]}" "${urls[$i]}"
done