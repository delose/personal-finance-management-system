#!/bin/bash

# Ensure uv is installed
if ! command -v uv &> /dev/null; then
    echo "Error: uv is not installed. Please install it first."
    exit 1
fi

echo "Installing dependencies using uv..."

# Install dependencies from pyproject.toml
# --frozen ensures it uses the lock file if it exists, otherwise resolves and creates one
uv sync --frozen

echo "Dependencies installed successfully."
