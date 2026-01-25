#!/bin/bash

# Gracefully stop Docker containers with Consul deregistration

echo "🛑 Stopping expense-service with Consul..."

# Step 1: Gracefully deregister from Consul
echo "Step 1: Deregistering from Consul..."
curl -X PUT http://localhost:8500/v1/agent/service/deregister/expense-service > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Successfully deregistered from Consul"
else
    echo "⚠️  Could not deregister from Consul (service may not be registered)"
fi

# Step 2: Stop Docker containers
echo "Step 2: Stopping Docker containers..."
docker-compose stop

# Step 3: Verify service is deregistered
echo "Step 3: Verifying deregistration..."
sleep 5

# Check if service is still registered
curl -f http://localhost:8500/v1/catalog/service/expense-service > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "✅ Expense-service successfully deregistered from Consul"
else
    echo "⚠️  Warning: Expense-service still appears in Consul catalog"
    echo "You may need to manually deregister with: curl -X PUT http://localhost:8500/v1/agent/service/deregister/expense-service"
fi

echo ""
echo "Stopped services:"
docker-compose ps
