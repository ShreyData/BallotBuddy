from pydantic import BaseModel, Field
from typing import Optional

class AIQueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500, description="The question to ask the AI.")

class AIQueryResponse(BaseModel):
    answer: str
    confidence: float
    source: str = "gemini"
    type: str = "informational"
    structured: bool = True

class MisinformationRequest(BaseModel):
    claim: str = Field(..., min_length=1, max_length=500, description="The claim to verify.")

class MisinformationResponse(BaseModel):
    claim: str
    is_true: bool
    explanation: str

class MisinformationResult(BaseModel):
    is_true: bool
    explanation: str
