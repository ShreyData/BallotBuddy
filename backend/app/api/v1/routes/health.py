from fastapi import APIRouter, Depends
from app.api.deps import get_firestore_client
from app.infrastructure.cache import CacheManager
from app.infrastructure.firestore_client import FirestoreClient

router = APIRouter()
_cache_manager = CacheManager()

@router.get('/')
async def health_check(
    firestore: FirestoreClient = Depends(get_firestore_client)
):
    """
    Comprehensive health check including external infrastructure dependencies.
    """
    health_status = {
        'status': 'healthy',
        'infrastructure': {
            'firestore': 'connected' if firestore.db else 'disconnected',
            'redis': 'unknown'
        }
    }
    
    # Check Redis
    try:
        # Simple ping to Redis
        await _cache_manager._redis.ping()
        health_status['infrastructure']['redis'] = 'connected'
    except Exception:
        health_status['infrastructure']['redis'] = 'disconnected'
        health_status['status'] = 'degraded'
        
    return health_status
