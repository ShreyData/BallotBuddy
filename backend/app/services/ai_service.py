from fastapi import HTTPException
from app.infrastructure.ai_provider import AIProvider
from app.infrastructure.cache import CacheManager
from app.core.logging import logger

class AiService:
    """
    Service class for handling AI-powered query logic.
    """
    def __init__(self, ai_provider: AIProvider, cache_manager: CacheManager):
        self.ai_provider = ai_provider
        self.cache_manager = cache_manager

    def _sanitize_input(self, text: str) -> str:
        """Basic sanitization of user input."""
        return text.strip()

    async def ask_question(self, question: str) -> dict:
        """
        Processes a user question, applies caching, and returns an AI-generated answer.
        """
        sanitized_question = self._sanitize_input(question)
        
        if not sanitized_question:
            raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
        if len(sanitized_question) > 500:
            raise HTTPException(status_code=400, detail="Question exceeds maximum length of 500 characters.")

        # Check Cache
        cached_answer = self.cache_manager.get(sanitized_question)
        if cached_answer:
            logger.info(f"Cache hit for question: {sanitized_question[:30]}...")
            return {
                "answer": cached_answer,
                "confidence": 0.95,  # Cached confidence
                "source": "cache",
                "type": "informational",
                "structured": True
            }

        try:
            prompt = f"Explain clearly in simple steps: {sanitized_question}"
            answer = await self.ai_provider.generate_response(prompt)
            
            # Save to Cache
            self.cache_manager.set(sanitized_question, answer)
            
            return {
                "answer": answer,
                "confidence": 0.9,
                "source": "gemini",
                "type": "informational",
                "structured": True
            }
        except Exception as e:
            logger.error(f"AiService Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate AI response: {str(e)}")
