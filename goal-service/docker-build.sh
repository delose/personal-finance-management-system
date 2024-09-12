#!/bin/bash

mvn clean package -DskipTests
docker build -t delose/goal-service:latest .
