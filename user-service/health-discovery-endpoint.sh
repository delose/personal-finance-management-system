#!/bin/bash

# Define Eureka server URL and the service ID
EUREKA_SERVER_URL="http://localhost:8761/eureka/apps/USER-SERVICE"

# Fetch the XML response from Eureka
response=$(curl -s $EUREKA_SERVER_URL)

# Check if the response contains the status "UP"
status=$(echo "$response" | xmllint --xpath "string(//instance/status)" -)

# Evaluate the status
if [ "$status" == "UP" ]; then
    echo "User-Service is UP"
else
    echo "User-Service is DOWN or UNREGISTERED"
    echo "Response was: $response"
fi