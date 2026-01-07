#!/usr/bin/env bash

# ==============================================================================
# Script Name:  manage-pfms.sh
# Description:  Starts PFMS infrastructure, UI, and Backend independently.
# ==============================================================================

set -e

# --- Configuration ---
UI_DIR="pfms-ui"
UI_SCRIPT="./run.sh"
BE_SCRIPT="./backend-docker-run.sh"
UI_PORT=3000
LOG_FILE="ui-startup.log"

# --- Functions ---

check_docker_running() {
    if ! docker info &> /dev/null; then
        echo "[ERROR] Docker daemon is not running."
        exit 1
    fi
}

kill_process_on_port() {
    local port=$1
    # -t (terse) returns only the PIDs, one per line
    local pids
    pids=$(lsof -t -i :$port)

    if [ -z "$pids" ]; then
        echo "[INFO] No process found on port $port."
    else
        echo "[INFO] Terminating processes on port $port: $pids"
        # Using xargs ensures each PID is passed as a separate argument to kill
        echo "$pids" | xargs kill -9
    fi
}

start_notifdb() {
    echo "[1/4] Starting Infrastructure: MongoDB (notifdb)..."
    ./notification-service/db-run.sh
}

# --- Main Execution ---

echo "Starting PFMS Management Suite..."
check_docker_running
kill_process_on_port $UI_PORT

# Step 1: Infrastructure
start_notifdb

# Step 2: Frontend UI
echo "[2/4] Starting Frontend UI..."
if [ -d "$UI_DIR" ]; then
    (cd "$UI_DIR" && $UI_SCRIPT) > "$LOG_FILE" 2>&1 &
    UI_PID=$!
    disown $UI_PID
    echo "[SUCCESS] UI started in background (PID: $UI_PID)."
else
    echo "[ERROR] UI directory not found."
    exit 1
fi

# Step 3: Backend Services
echo "[3/4] Starting Backend services..."
if [ -f "$BE_SCRIPT" ]; then
    # Start backend in background to avoid blocking the terminal
    bash "$BE_SCRIPT" &
    BE_PID=$!
    disown $BE_PID
    echo "[SUCCESS] Backend started in background (PID: $BE_PID)."
else
    echo "[ERROR] Backend script not found."
    exit 1
fi

echo "[4/4] System is initializing..."
echo "------------------------------------------------"
echo "All components triggered. Terminal is now free."
echo "Check $LOG_FILE for UI startup progress."
