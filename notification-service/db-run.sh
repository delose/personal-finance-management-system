#!/usr/bin/env bash

docker stop notifdb 2>/dev/null || true
docker rm -v notifdb 2>/dev/null || true

# Start detached
docker run -d \
  --name notifdb \
  -p 3308:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  --restart unless-stopped \
  mongo:latest

# Wait for MongoDB to be ready
sleep 2
if ! docker ps | grep -q notifdb; then
    echo "[ERROR] MongoDB failed to start. Check 'docker logs notifdb'."
    exit 1
fi
echo "[SUCCESS] MongoDB is up on port 3308."