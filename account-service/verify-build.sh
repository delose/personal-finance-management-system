#!/bin/bash
# verify-build.sh for NestJS

# Check if dist directory exists and has content
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    exit 0 # Success: Artifact exists
else
    exit 1 # Failure: Artifact missing
fi
