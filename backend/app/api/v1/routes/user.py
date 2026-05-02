import uuid
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user_id
from app.core.security import create_access_token
from pydantic import BaseModel

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post('/login/guest', response_model=Token)
async def login_guest():
    """
    Issues a JWT for a guest user.
    Simulates a login to provide a valid token for testing.
    """
    guest_id = f"guest_{uuid.uuid4().hex[:8]}"
    access_token = create_access_token(subject=guest_id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get('/me')
async def get_me(user_id: str = Depends(get_current_user_id)):
    return {'id': user_id}
