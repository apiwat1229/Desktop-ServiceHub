#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/apiwat1229/Desktop-ServiceHub"

echo "🚀 Deploying Desktop-ServiceHub..."
cd "$PROJECT_DIR"

echo "📦 Building & starting Docker container..."
docker compose -p desktop-servicehub up -d --build

echo "✅ Deploy complete!"
echo "   🌐 https://app.ytrc.co.th"
