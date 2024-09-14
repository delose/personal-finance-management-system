#!/bin/bash

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Error: No environment provided. Please specify 'dev' or 'prod'."
  exit 1
fi

# Check if the argument is either 'dev' or 'prod'
if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
  echo "Error: Invalid environment '$1'. Please specify 'dev' or 'prod'."
  exit 1
fi

# Build the project
mvn clean package

# Run the Spring Boot application with the specified profile
java -jar target/user-service-0.0.1-SNAPSHOT.jar --spring.profiles.active="$1"