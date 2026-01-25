#!/bin/bash

# Gracefully restart Docker containers with Consul deregistration and registration

echo "🔄 Restarting expense-service with Consul..."

# Step 1: Gracefully deregister from Consul
echo "Step 1: Deregistering from Consul..."
curl -X PUT http://localhost:8500/v1/agent/service/deregister/expense-service > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Successfully deregistered from Consul"
else
    echo "⚠️  Could not deregister from Consul (service may not be registered)"
fi

# Step 2: Stop containers
echo "Step 2: Stopping containers..."
./stop-remote-docker.sh

# Step 3: Build Docker image
echo "Step 3: Building Docker image..."
./docker-build.sh
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Docker build failed with exit code $BUILD_STATUS"
    echo "Restart aborted due to build errors"
    exit $BUILD_STATUS
fi

echo "✅ Docker build successful"

# Step 4: Start containers
echo "Step 4: Starting containers..."
./run-docker.sh

# Step 5: Verify registration
echo "Step 5: Verifying Consul registration..."
sleep 10

# Check if service is registered
curl -f http://localhost:8500/v1/catalog/service/expense-service > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Expense-service successfully restarted and registered with Consul"
    echo "📊 View service in Consul UI: http://localhost:8500/ui/dc1/services/expense-service"
else
    echo "❌ Error: Expense-service not found in Consul after restart"
    echo "Check logs with: docker-compose -f docker-compose.consul.yml logs"
    exit 1
fi
