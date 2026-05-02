import redis.asyncio as redis
from typing import Any, Optional, Dict
import time
from app.core.config import settings
from app.core.logging import logger

class CacheManager:
    """
    Distributed cache manager using Redis, with an in-memory fallback for serverless/local environments.
    """
    def __init__(self, default_ttl: int = 3600):
        self._default_ttl = default_ttl
        self.use_redis = settings.REDIS_URL and settings.REDIS_URL != "memory"
        
        if self.use_redis:
            try:
                self._redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
                logger.info(f"CacheManager initialized with Redis at {settings.REDIS_URL}")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {e}. Falling back to in-memory cache.")
                self.use_redis = False
        
        if not self.use_redis:
            self._memory_cache: Dict[str, Dict[str, Any]] = {}
            logger.info("CacheManager initialized with in-memory fallback.")

    async def get(self, key: str) -> Optional[Any]:
        """
        Retrieves a value from the active cache layer.
        """
        if self.use_redis:
            try:
                return await self._redis.get(key)
            except Exception as e:
                logger.error(f"Redis get error: {e}")
                return None
        else:
            item = self._memory_cache.get(key)
            if item:
                if item["expires_at"] > time.time():
                    return item["value"]
                else:
                    del self._memory_cache[key]
            return None

    async def set(self, key: str, value: str, ttl: Optional[int] = None):
        """
        Sets a value in the active cache layer with a TTL.
        """
        duration = ttl if ttl is not None else self._default_ttl
        if self.use_redis:
            try:
                await self._redis.setex(key, duration, value)
            except Exception as e:
                logger.error(f"Redis set error: {e}")
        else:
            self._memory_cache[key] = {
                "value": value,
                "expires_at": time.time() + duration
            }

    async def clear(self):
        """Clears the active cache layer."""
        if self.use_redis:
            try:
                await self._redis.flushdb()
            except Exception as e:
                logger.error(f"Redis flush error: {e}")
        else:
            self._memory_cache.clear()
