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
        cached_answer = await self.cache_manager.get(sanitized_question)
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
            # 1. Generate embedding for RAG
            query_vector = await self.ai_provider.generate_embedding(sanitized_question)
            
            # 2. Retrieve relevant context from Firestore Vector Search
            relevant_facts = await self.firestore_client.query_knowledge_base(query_vector)
            context = "\n".join([f"- {fact}" for fact in relevant_facts]) if relevant_facts else "No specific context found."
            
            # 3. Formulate system instruction with grounded context
            system_instruction = (
                "You are BallotBuddy AI, an expert assistant for the Indian Election system. "
                "Your goal is to explain ECI (Election Commission of India) procedures, NVSP registration, "
                "and the EVM/VVPAT process in an easy-to-follow way. "
                "Always be concise, accurate, and strictly non-partisan. Explain using Indian terminology (EPIC, BLO, Form 6).\n\n"
                "Ground your response ONLY in the following provided context if relevant. "
                "If the context doesn't contain the answer, use your knowledge of Indian election laws but state that procedures may vary slightly by state.\n\n"
                f"CONTEXT:\n{context}"
            )
            
            # 4. Generate grounded response
            answer = await self.ai_provider.generate_response(
                prompt=sanitized_question, 
                system_instruction=system_instruction
            )
            
            # Save to Cache
            await self.cache_manager.set(sanitized_question, answer)
            
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
