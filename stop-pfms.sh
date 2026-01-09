#!/usr/bin/env bash

# ==============================================================================
# Script Name:  stop-pfms.sh
# Description:  Stops UI, Backend (Docker/Compose), and specified DBs.
# ==============================================================================

# --- Configuration ---
UI_PORT=3000
# Updated to a list to accommodate multiple databases
DB_NAMES=("notifdb" "apigwdb")

# Services that use 'docker stop' (Single container services)
docker_services=(
    "consul-server"
    "config-server"
    "discovery-server"
    "api-gateway"
    "budget-service"
    "goal-service"
    "notification-service"
)

# Modules with internal docker-compose.yml files
# Ensure these paths correctly point to the module directories from this script
compose_modules=(
    "account-service"
    "transaction-service"
    "kafka"
    "message-broker"
)

# --- Functions ---

stop_ui() {
    echo "[1/4] Stopping Frontend UI on port $UI_PORT..."
    local pids=$(lsof -t -i :$UI_PORT)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -9
        echo "[SUCCESS] UI processes terminated."
    else
        echo "[INFO] No UI process found on port $UI_PORT."
    fi
}

stop_compose_modules() {
    echo "[2/4] Running 'docker compose down' for specific modules..."
    for module in "${compose_modules[@]}"; do
        if [ -d "$module" ]; then
            echo "Downing module: $module..."
            # Using -f to target the compose file in each subdirectory
            (cd "$module" && docker compose down) >/dev/null 2>&1
        else
            echo "[WARN] Directory $module not found, skipping compose down."
        fi
    done
    echo "[SUCCESS] Compose modules shut down."
}

stop_dockerized_services() {
    echo "[3/4] Stopping standalone Backend & Middleware Containers..."
    for service in "${docker_services[@]}"; do
        if [ "$(docker ps -q -f name=^/${service}$)" ]; then
            echo "Stopping $service..."
            docker stop "$service" >/dev/null
        fi
    done
    echo "[SUCCESS] All standalone containers stopped."
}

stop_infrastructure() {
    echo "[4/4] Stopping Infrastructure Databases..."
    for db in "${DB_NAMES[@]}"; do
        if [ "$(docker ps -q -f name=^/${db}$)" ]; then
            echo "Stopping $db..."
            docker stop "$db" >/dev/null
            echo "[SUCCESS] $db stopped."
        else
            echo "[INFO] $db is not running."
        fi
    done
}

# --- Main Execution ---

echo "Stopping PFMS Management Suite..."

stop_ui
stop_compose_modules
stop_dockerized_services
stop_infrastructure

echo "------------------------------------------------"
echo "All PFMS services have been shut down."
