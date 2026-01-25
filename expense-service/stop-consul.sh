#!/bin/bash

# Deregister service from Consul
echo "Deregistering expense-service from Consul..."
curl -X PUT http://localhost:8500/v1/agent/service/deregister/expense-service

# Stop Docker containers
echo "Stopping Docker containers..."
docker-compose -f docker-compose.consul.yml down

echo "Expense-service deregistered and stopped."
