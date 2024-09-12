#!/bin/bash

mvn clean package -DskipTests
docker build -t delose/discovery-server:latest .
