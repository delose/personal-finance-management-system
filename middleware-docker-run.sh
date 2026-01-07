#!/usr/bin/env bash

# Function to start a specific middleware
start_mw() {
    local MW_NAME="$1" # 'local' prevents variable leakage
    echo "--------------------------------"
    echo "Checking middleware: $MW_NAME"

    # Check if the directory exists before entering
    if [ -d "$MW_NAME" ]; then
        # Use a subshell (parentheses) so you don't need to 'cd ..' manually
        (
            cd "$MW_NAME" || exit
            if [ -f "./run.sh" ]; then
                ./run.sh
            else
                echo "Error: ./run.sh not found in $MW_NAME"
            fi
        )
    else
        echo "Error: Directory $MW_NAME not found."
    fi
}

# List of middlewares
middlewares=(
    "consul-server"
    "kafka"
    "message-broker"
)

# Loop through every mw and start it
for mw in "${middlewares[@]}"; do
    start_mw "$mw" # FIXED: Added '$' to pass the variable value
done

