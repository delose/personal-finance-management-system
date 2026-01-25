#!/bin/bash

# Start Docker containers with Consul
echo "Starting expense-service with Consul..."
docker-compose -f docker-compose.consul.yml up -d

# Wait for service to be ready
echo "Waiting for service to be ready..."
sleep 10

# Check if service is registered
echo "Checking service registration..."
curl http://localhost:8500/v1/catalog/service/expense-service

echo "Expense-service started. Check Consul UI at http://localhost:8500/ui/dc1/services/expense-service"
