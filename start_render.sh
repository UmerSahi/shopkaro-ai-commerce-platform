#!/bin/bash
set -e

echo "=========================================================="
echo "Starting ShopKaro Unified Full-Stack Platform on Render"
echo "=========================================================="

# Limit Node.js heap memory to 96MB (crucial for Render Free 512MB RAM tier)
export NODE_OPTIONS="--max-old-space-size=96"
export PYTHONUNBUFFERED=1

# 1. Start FastAPI in background on 127.0.0.1:8000 (strictly 1 worker to conserve RAM)
echo "[1/2] Starting FastAPI Backend on 127.0.0.1:8000 (1 worker)..."
python -m uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --workers 1 &
BACKEND_PID=$!

# 2. Wait for FastAPI to warm up
echo "Warming up AI models and endpoints..."
sleep 3

# Trap exit signals to gracefully terminate the backend
trap "kill -TERM $BACKEND_PID" SIGINT SIGTERM EXIT

# 3. Start Next.js on Render's assigned $PORT
PORT=${PORT:-10000}
echo "[2/2] Starting Next.js Frontend on port $PORT..."
cd frontend
exec npx next start -p "$PORT"
