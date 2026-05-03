from typing import Optional

import firebase_admin
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth

from app.core.config import settings
from app.core.logging import logger
from app.infrastructure.cache import CacheManager
from app.infrastructure.firestore_client import FirestoreClient
from app.infrastructure.gemini_client import GeminiClient
from app.infrastructure.translation_client import TranslationClient
from app.services.ai_service import AiService
from app.services.election_service import ElectionService
from app.services.misinformation_service import MisinformationService
from app.services.personalization_service import PersonalizationService
from app.services.timeline_service import TimelineService

# Initialize Firebase Admin
_firebase_initialized = False
if not firebase_admin._apps:
    try:
        # Strict initialization for production
        firebase_admin.initialize_app()
        logger.info("Firebase Admin initialized successfully.")
        _firebase_initialized = True
    except Exception as e:
        logger.error(f"CRITICAL: Failed to initialize Firebase Admin: {str(e)}")
        # In production, we don't want to start without Auth
        if not settings.GEMINI_API_KEY.startswith("AIza"): # Simple dev check
             logger.warning("Auth features are DISABLED. Only for development.")
        else:
             raise RuntimeError(f"Firebase initialization failed: {e}") from e

# Singletons for infrastructure
_gemini_client = GeminiClient()
_cache_manager = CacheManager()
_firestore_client = FirestoreClient()
_translation_client = TranslationClient()

# Use HTTPBearer for Firebase Token extraction from 'Authorization: Bearer <token>'
security = HTTPBearer(auto_error=False)

def get_current_user_id(
    request: Request,
    res: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> str:
    """
    Verifies the Firebase ID token from a cookie or Authorization header.
    Returns the user's unique UID.
    """
    if not _firebase_initialized:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is currently unavailable.",
        )
    
    # 1. Try to get token from cookie (Security Best Practice)
    token = request.cookies.get("bb_auth_token")
    
    # 2. Fallback to Authorization header if no cookie
    if not token and res:
        token = res.credentials
        
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please login.",
        )

    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token.get("uid")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return user_id
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed.",
        ) from e

def get_ai_service() -> AiService:
    return AiService(
        ai_provider=_gemini_client, 
        cache_manager=_cache_manager, 
        firestore_client=_firestore_client,
        translation_client=_translation_client
    )

def get_election_service() -> ElectionService:
    return ElectionService()

def get_timeline_service() -> TimelineService:
    return TimelineService()

def get_personalization_service() -> PersonalizationService:
    return PersonalizationService()

def get_misinformation_service() -> MisinformationService:
    return MisinformationService(ai_provider=_gemini_client)

def get_firestore_client() -> FirestoreClient:
    return _firestore_client
