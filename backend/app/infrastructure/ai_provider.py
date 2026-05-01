from abc import ABC, abstractmethod

class AIProvider(ABC):
    """
    Interface for AI response generation providers.
    """
    @abstractmethod
    async def generate_response(self, prompt: str) -> str:
        """
        Generates a response for a given prompt.
        
        Args:
            prompt: The input prompt for the AI.
            
        Returns:
            The generated text response.
        """
        pass
