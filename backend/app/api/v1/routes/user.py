from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel

from app.api.deps import get_current_user_id

router = APIRouter()

class TokenRequest(BaseModel):
    id_token: str

@router.post('/login')
async def login(request: TokenRequest, response: Response):
    """
    Sets the Firebase ID token as a secure, HttpOnly cookie.
    """
    # In a real production app, you might want to exchange the ID token for a session cookie
    # using firebase_admin.auth.create_session_cookie, but for simplicity we'll store the JWT securely.
    response.set_cookie(
        key="bb_auth_token",
        value=request.id_token,
        httponly=True,
        secure=True, # Should be True in production
        samesite="strict",
        max_age=3600 # 1 hour
    )
    return {"status": "success"}

@router.post('/logout')
async def logout(response: Response):
    """
    Clears the authentication cookie.
    """
    response.delete_cookie("bb_auth_token")
    return {"status": "success"}

@router.get('/me')
async def get_me(user_id: str = Depends(get_current_user_id)):
    """
    Returns the current authenticated user's ID.
    Verified via Firebase Admin SDK.
    """
    return {'id': user_id}
