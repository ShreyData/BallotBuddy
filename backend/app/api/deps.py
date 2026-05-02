from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.security import ALGORITHM
from app.infrastructure.gemini_client import GeminiClient
from app.infrastructure.cache import CacheManager
from app.infrastructure.firestore_client import FirestoreClient
from app.services.ai_service import AiService
from app.services.election_service import ElectionService
from app.services.timeline_service import TimelineService
from app.services.personalization_service import PersonalizationService
from app.services.misinformation_service import MisinformationService

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/users/login/guest"
)

# Shared instances for singleton-like behavior where appropriate
_cache_manager = CacheManager()
_gemini_client = GeminiClient()
_firestore_client = FirestoreClient()

def get_current_user_id(token: str = Depends(reusable_oauth2)) -> str:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

def get_ai_service() -> AiService:
    return AiService(
        ai_provider=_gemini_client, 
        cache_manager=_cache_manager, 
        firestore_client=_firestore_client
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
