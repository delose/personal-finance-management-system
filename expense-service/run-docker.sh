#!/usr/bin/env bash

# Start Docker containers with Consul service registration
echo "Starting expense-service with Consul..."

# Start the main application and Consul services
docker-compose -f docker-compose.consul.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 15

# Check if Consul server is running
echo "Checking Consul server status..."
until curl -f http://localhost:8500/v1/status/leader > /dev/null 2>&1; do
    echo "Waiting for Consul server to be ready..."
    sleep 5
done

# Check if expense-service is registered
echo "Checking expense-service registration..."
curl -f http://localhost:8500/v1/catalog/service/expense-service > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Expense-service successfully registered with Consul"
    echo "📊 View service in Consul UI: http://localhost:8500/ui/dc1/services/expense-service"
else
    echo "⚠️  Warning: Expense-service not found in Consul. Check logs with: docker-compose -f docker-compose.consul.yml logs"
fi

# Show running services
echo ""
echo "Running services:"
docker-compose -f docker-compose.consul.yml ps
