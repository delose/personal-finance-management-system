#!/bin/bash

# Run docker build and capture the exit status
./docker-build.sh
BUILD_STATUS=$?

# Check if build was successful
if [ $BUILD_STATUS -eq 0 ]; then
    echo "Docker build successful, proceeding with restart..."
    ./stop-remote-docker.sh
    ./run-docker.sh
else
    echo "Docker build failed with exit code $BUILD_STATUS"
    echo "Skipping container restart due to build errors"
    exit $BUILD_STATUS
fi
