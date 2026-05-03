from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_firestore_client
from app.api.v1.routes import ai, election, health, timeline, user
from app.infrastructure.firestore_client import FirestoreClient

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(election.router, prefix="/elections", tags=["elections"])
api_router.include_router(timeline.router, prefix="/timeline", tags=["timeline"])
api_router.include_router(user.router, prefix="/users", tags=["users"])

@api_router.get("/trending", tags=["analytics"])
async def get_trending(db: Annotated[FirestoreClient, Depends(get_firestore_client)]):
    return await db.get_trending_topics()
