FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (build tools, curl, and Node.js 20 LTS)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project source code
COPY . .

# Build Next.js frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build
WORKDIR /app

# Make startup script executable
RUN chmod +x start_render.sh

# Environment variables (strict memory limits for 512MB RAM tier)
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=80"
ENV MALLOC_ARENA_MAX=2
ENV MALLOC_TRIM_THRESHOLD_=65536
ENV REDIS_HOST=""

# Expose port (Render sets $PORT dynamically, defaults to 10000)
EXPOSE 10000

# Health check hits Next.js on $PORT which rewrites /health to FastAPI
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/health || exit 1

# Start unified full-stack application (FastAPI on 8000 + Next.js on $PORT)
CMD ["./start_render.sh"]
