from fastapi import HTTPException
from app.infrastructure.ai_provider import AIProvider
from app.infrastructure.cache import CacheManager
from app.infrastructure.firestore_client import FirestoreClient
from app.core.logging import logger

class AiService:
    """
    Service class for handling AI-powered query logic with session tracking.
    """
    def __init__(self, ai_provider: AIProvider, cache_manager: CacheManager, firestore_client: FirestoreClient):
        self.ai_provider = ai_provider
        self.cache_manager = cache_manager
        self.firestore_client = firestore_client

    def _sanitize_input(self, text: str) -> str:
        """Basic sanitization of user input."""
        return text.strip()

    async def ask_question(self, user_id: str, question: str) -> dict:
        """
        Processes a user question, applies caching, saves to Firestore, and returns an answer.
        """
        sanitized_question = self._sanitize_input(question)
        
        if not sanitized_question:
            raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
        if len(sanitized_question) > 500:
            raise HTTPException(status_code=400, detail="Question exceeds maximum length of 500 characters.")

        # Check Cache
        cached_answer = self.cache_manager.get(sanitized_question)
        if cached_answer:
            logger.info(f"Cache hit for question: {sanitized_question[:30]}...", extra={"user_id": user_id})
            # Even on cache hit, we might want to log the interaction or skip Firestore for efficiency
            return {
                "answer": cached_answer,
                "confidence": 0.95,
                "source": "cache",
                "type": "informational",
                "structured": True
            }

        try:
            prompt = f"Explain clearly in simple steps: {sanitized_question}"
            answer = await self.ai_provider.generate_response(prompt)
            
            # Save to Cache
            self.cache_manager.set(sanitized_question, answer)
            
            # Save to Firestore for session tracking
            await self.firestore_client.save_user_query(user_id, sanitized_question, {"answer": answer})
            
            return {
                "answer": answer,
                "confidence": 0.9,
                "source": "gemini",
                "type": "informational",
                "structured": True
            }
        except Exception as e:
            logger.error(f"AiService Error: {str(e)}", extra={"user_id": user_id})
            raise HTTPException(status_code=500, detail=f"Failed to generate AI response: {str(e)}")
