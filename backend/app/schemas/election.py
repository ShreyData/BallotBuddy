from pydantic import BaseModel, Field
from typing import List

class ElectionGuideRequest(BaseModel):
    role: str = Field(..., min_length=1, max_length=50, description="The user's role (e.g., voter, student).")

class ElectionGuideResponse(BaseModel):
    role: str
    steps: List[str]

class PersonalizedFlowRequest(BaseModel):
    age: int = Field(..., ge=18, le=120, description="User's age.")
    role: str = Field(..., min_length=1, max_length=50, description="User's role.")

class PersonalizedFlowResponse(BaseModel):
    flow_type: str
    guidance: List[str]
