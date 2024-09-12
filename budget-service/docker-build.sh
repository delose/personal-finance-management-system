#!/bin/bash

mvn clean package -DskipTests
docker build -t delose/budget-service:latest .
