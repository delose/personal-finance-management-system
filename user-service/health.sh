#!/bin/bash

# Service name for better readability
service_name="User Service"

# Credentials
username="pfms"  # Replace with actual username
password="pfms"  # Replace with actual password

# Send a GET request to the health endpoint with basic authentication
response=$(curl -s -u "$username:$password" -w "\nHTTP_STATUS: %{http_code}\n" "http://localhost:8081/actuator/health" | tr -d '[:space:]')

# Extract the HTTP status code from the response
http_status=$(echo "$response" | grep "HTTP_STATUS:200")

# Check the status code
if [ "$http_status" != "" ]; then
    echo "$service_name is UP"
else
    echo "$service_name is DOWN or UNREACHABLE"
    echo "Response was: $response"
fi
