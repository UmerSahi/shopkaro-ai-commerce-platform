#!/bin/bash
set -e

echo "=========================================================="
echo "Starting ShopKaro Unified Full-Stack Platform on Render"
echo "=========================================================="

# Strict Linux glibc & Python memory clamping for Render 512MB RAM tier
export MALLOC_ARENA_MAX=2
export MALLOC_TRIM_THRESHOLD_=65536
export PYTHONUNBUFFERED=1

# Limit Node.js heap memory to 80MB (crucial for Render Free 512MB RAM tier)
export NODE_OPTIONS="--max-old-space-size=80"

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
