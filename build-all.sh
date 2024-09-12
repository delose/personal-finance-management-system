#!/bin/bash

# Define an array of service directories
services=("config-server" "discovery-server" "api-gateway" "message-broker" "user-service" "budget-service" "expense-service" "goal-service" "notification-service" "reporting-service")

# Function to build a module
build_module() {
  local module=$1
  echo "------------------------------------"
  echo "Building $module..."
  echo "------------------------------------"

  # Navigate to the module directory and run mvn clean install
  (cd $module && mvn clean install)

  # Check if the build was successful
  if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build $module."
    exit 1
  fi

  echo "Successfully built $module."
  echo "------------------------------------"
}

# Build the parent project first
echo "------------------------------------"
echo "Building parent project (pfms-parent)..."
echo "------------------------------------"
mvn clean install

if [ $? -ne 0 ]; then
  echo "ERROR: Failed to build parent project."
  exit 1
fi

echo "Successfully built parent project."
echo "------------------------------------"

# Loop through each service and build it
for service in "${services[@]}"; do
  build_module $service
done

echo "------------------------------------"
echo "All modules built successfully."
echo "------------------------------------"