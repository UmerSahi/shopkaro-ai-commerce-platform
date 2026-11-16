#!/bin/bash
set -e

echo "=========================================================="
echo "Starting ShopKaro Unified Full-Stack Platform on Render"
echo "=========================================================="

# 1. Start FastAPI in background on 127.0.0.1:8000
echo "[1/2] Starting FastAPI Backend on 127.0.0.1:8000..."
python -m uvicorn src.api.main:app --host 127.0.0.1 --port 8000 &
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
