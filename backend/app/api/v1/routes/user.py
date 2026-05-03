from fastapi import APIRouter, Depends, Response, Request
from pydantic import BaseModel

from app.api.deps import get_current_user_id
from app.core.limiter import limiter

router = APIRouter()

class TokenRequest(BaseModel):
    id_token: str

@router.post('/login')
@limiter.limit("5/minute")
async def login(request: Request, token_req: TokenRequest, response: Response):
    """
    Sets the Firebase ID token as a secure, HttpOnly cookie.
    """
    # In a real production app, you might want to exchange the ID token for a session cookie
    # using firebase_admin.auth.create_session_cookie, but for simplicity we'll store the JWT securely.
    response.set_cookie(
        key="bb_auth_token",
        value=token_req.id_token,
        httponly=True,
        secure=True, # Should be True in production
        samesite="strict",
        max_age=3600 # 1 hour
    )
    return {"status": "success"}

@router.post('/logout')
@limiter.limit("10/minute")
async def logout(request: Request, response: Response):
    """
    Clears the authentication cookie.
    """
    response.delete_cookie("bb_auth_token")
    return {"status": "success"}

@router.get('/me')
@limiter.limit("20/minute")
async def get_me(request: Request, user_id: str = Depends(get_current_user_id)):
    """
    Returns the current authenticated user's ID.
    Verified via Firebase Admin SDK.
    """
    return {'id': user_id}
