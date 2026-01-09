#!/bin/bash
CHART_DIR="."

echo "--- 🔄 Updating Dependencies ---"

helm repo update
helm dependency update