from typing import List, Optional

from pydantic import BaseModel


class TimelinePhase(BaseModel):
    phase: str
    description: str
    date: Optional[str] = None

class TimelineResponse(BaseModel):
    events: List[TimelinePhase]
