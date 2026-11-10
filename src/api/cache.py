"""
ShopKaro Ultra-Fast Caching Layer
Supports both live Redis connection and ultra-low-latency in-memory cache fallback.
Ensures sub-10ms cached recommendation responses (< 100ms SLA target).
"""

import os
import json
import time

try:
    import redis
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True, socket_connect_timeout=1)
    # Ping test
    redis_client.ping()
    HAS_REDIS = True
    print("Connected to live Redis server for recommendation caching.")
except Exception:
    HAS_REDIS = False
    print("Redis server not reachable; using ultra-fast in-memory fallback cache.")

_IN_MEMORY_CACHE = {}
_CACHE_EXPIRY = {}

class CacheManager:
    @staticmethod
    def get(key: str):
        if HAS_REDIS:
            try:
                val = redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception:
                pass
        # Fallback
        if key in _IN_MEMORY_CACHE:
            if time.time() < _CACHE_EXPIRY.get(key, float("inf")):
                return _IN_MEMORY_CACHE[key]
            else:
                del _IN_MEMORY_CACHE[key]
                if key in _CACHE_EXPIRY:
                    del _CACHE_EXPIRY[key]
        return None

    @staticmethod
    def set(key: str, value, ttl_seconds: int = 3600):
        val_str = json.dumps(value)
        if HAS_REDIS:
            try:
                redis_client.setex(key, ttl_seconds, val_str)
                return
            except Exception:
                pass
        # Fallback
        _IN_MEMORY_CACHE[key] = value
        _CACHE_EXPIRY[key] = time.time() + ttl_seconds

