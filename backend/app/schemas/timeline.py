from pydantic import BaseModel
from typing import List

class TimelinePhase(BaseModel):
    phase: str
    description: str

class TimelineResponse(BaseModel):
    events: List[TimelinePhase]
