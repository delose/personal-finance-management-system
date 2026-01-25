#!/bin/bash

# Wait for Consul to be ready
echo "Waiting for Consul to be ready..."
until curl -f http://consul-server:8500/v1/status/leader > /dev/null 2>&1; do
    sleep 2
done

echo "Consul is ready. Registering expense-service..."

# Register the service with Consul
curl -X PUT \
  -H "Content-Type: application/json" \
  -d @/var/www/html/consul-service.json \
  http://consul-server:8500/v1/agent/service/register

echo "Expense-service registered with Consul."
