from abc import ABC, abstractmethod
from typing import Any, List, Union


class AIProvider(ABC):
    """
    Interface for AI response generation providers.
    """
    @abstractmethod
    async def generate_response(
        self, 
        prompt: Union[str, List[Any]], 
        system_instruction: str = None, 
        response_schema: Any = None
    ) -> str:
        """
        Generates a response for a given prompt with optional system instruction and response schema.
        """
        pass

    @abstractmethod
    async def generate_embedding(self, text: str) -> list[float]:
        """
        Generates a vector embedding for the given text.
        """
        pass
