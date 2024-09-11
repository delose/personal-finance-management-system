#!/bin/bash

mvn clean package -DskipTests
docker build -t delose/api-gateway:latest .
