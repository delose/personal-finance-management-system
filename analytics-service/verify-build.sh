#!/usr/bin/env bash
# Check if the image 'pfms-analytics' (or whatever your image name is) exists
if [ -n "$(docker images -q analytics-service-analytics-service)" ]; then
  exit 0 # Image exists, skip build
else
  exit 1 # Image missing, need build
fi
