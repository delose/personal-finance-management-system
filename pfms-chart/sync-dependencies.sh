#!/bin/bash
CHART_DIR="."

echo "--- 🔄 Syncing Dependencies ---"

# Build dependencies based on Chart.yaml
# 'build' is better than 'update' for local file:// paths
# because it uses Chart.lock if it exists.
helm dependency build $CHART_DIR

echo "📋 Verifying Sync Status:"
helm dependency list $CHART_DIR

echo "🧪 Final Lint Check:"
helm lint $CHART_DIR
