from fastapi import APIRouter
from app.api.v1.routes import health, ai, election, timeline, user

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(election.router, prefix="/elections", tags=["elections"])
api_router.include_router(timeline.router, prefix="/timeline", tags=["timeline"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
