#!/usr/bin/env bash

start_service() {
    SERVICE_NAME=$1
    echo "Building $SERVICE_NAME..."

    if ./verify-build.sh; then
      echo "Artifact found for $SERVICE_NAME. Skipping build..."
    else
      echo "Artifact missing for $SERVICE_NAME. Running build..."
      ./docker-build.sh
    fi

    ./run-docker.sh

}

services=(
    "analytics-service"
)

for service in "${services[@]}"
do
    start_service $service
done


