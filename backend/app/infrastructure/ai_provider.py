from abc import ABC, abstractmethod

class AIProvider(ABC):
    """
    Interface for AI response generation providers.
    """
    @abstractmethod
    async def generate_response(
        self, 
        prompt: str, 
        system_instruction: str = None, 
        response_schema: dict = None
    ) -> str:
        """
        Generates a response for a given prompt with optional system instruction and response schema.
        
        Args:
            prompt: The input prompt for the AI (user input).
            system_instruction: Guidelines or persona for the AI.
            response_schema: Optional schema for structured output (as a dict or Pydantic model).
            
        Returns:
            The generated text response (usually JSON if response_schema is provided).
        """
        pass

    @abstractmethod
    async def generate_embedding(self, text: str) -> list[float]:
        """
        Generates a vector embedding for the given text.
        """
        pass
