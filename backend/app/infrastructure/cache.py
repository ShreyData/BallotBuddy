import redis.asyncio as redis
from typing import Any, Optional
from app.core.config import settings
from app.core.logging import logger

class CacheManager:
    """
    Distributed cache manager using Redis for efficient scaling and TTL management.
    """
    def __init__(self, default_ttl: int = 3600):
        self._redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self._default_ttl = default_ttl

    async def get(self, key: str) -> Optional[Any]:
        """
        Retrieves a value from Redis cache.
        """
        try:
            return await self._redis.get(key)
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None

    async def set(self, key: str, value: str, ttl: Optional[int] = None):
        """
        Sets a value in Redis with a specific TTL.
        """
        try:
            duration = ttl if ttl is not None else self._default_ttl
            await self._redis.setex(key, duration, value)
        except Exception as e:
            logger.error(f"Redis set error: {e}")

    async def clear(self):
        """Clears the Redis cache."""
        try:
            await self._redis.flushdb()
        except Exception as e:
            logger.error(f"Redis flush error: {e}")
