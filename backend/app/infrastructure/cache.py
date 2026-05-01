import time
import hashlib
from typing import Any, Optional, Dict

class CacheManager:
    """
    Thread-safe (conceptual) in-memory cache with TTL support and hashed keys.
    """
    def __init__(self, default_ttl: int = 3600):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._default_ttl = default_ttl

    def _hash_key(self, key: str) -> str:
        """Creates a SHA-256 hash of the key."""
        return hashlib.sha256(key.encode()).hexdigest()

    def get(self, key: str) -> Optional[Any]:
        """
        Retrieves a value from the cache if it hasn't expired.
        """
        hashed_key = self._hash_key(key)
        item = self._cache.get(hashed_key)
        
        if item:
            if item["expires_at"] > time.time():
                return item["value"]
            else:
                # Cleanup expired item
                del self._cache[hashed_key]
        
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """
        Sets a value in the cache with a specific TTL.
        """
        hashed_key = self._hash_key(key)
        duration = ttl if ttl is not None else self._default_ttl
        self._cache[hashed_key] = {
            "value": value,
            "expires_at": time.time() + duration
        }

    def clear(self):
        """Clears the entire cache."""
        self._cache.clear()
