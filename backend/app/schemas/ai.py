from typing import Optional

from pydantic import BaseModel, Field


class AIQueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500, description="The question to ask the AI.")

class AIQueryResponse(BaseModel):
    answer: str
    reasoning: Optional[str] = None
    confidence_score: Optional[float] = None
    source: str = "gemini"
    type: str = "informational"
    structured: bool = True
    language: str = "en"

class StructuredAIResponse(BaseModel):
    answer: str
    reasoning: str
    confidence_score: float

class MisinformationRequest(BaseModel):
    claim: str = Field(..., min_length=1, max_length=500, description="The claim to verify.")

class MisinformationResponse(BaseModel):
    claim: str
    is_true: bool
    explanation: str

class MisinformationResult(BaseModel):
    is_true: bool
    explanation: str
