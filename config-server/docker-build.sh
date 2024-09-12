#!/bin/bash

mvn clean package -DskipTests
docker build -t delose/config-server:latest .
