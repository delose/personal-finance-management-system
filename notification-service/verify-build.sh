#!/bin/bash
# verify-build.sh for Spring Boot

# Check if target directory contains at least one .jar file
if ls target/*.jar >/dev/null 2>&1; then
    exit 0 # Success: Artifact exists
else
    exit 1 # Failure: Artifact missing
fi
