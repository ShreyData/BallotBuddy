from typing import Any, Dict

from fastapi import HTTPException

from app.core.logging import logger
from app.infrastructure.ai_provider import AIProvider
from app.infrastructure.cache import CacheManager
from app.infrastructure.firestore_client import FirestoreClient
from app.infrastructure.translation_client import TranslationClient
from app.schemas.ai import StructuredAIResponse


class AiService:
    """
    Service class for handling AI-powered query logic with session tracking and multi-language support.
    """
    def __init__(self, ai_provider: AIProvider, cache_manager: CacheManager, firestore_client: FirestoreClient, translation_client: TranslationClient):
        """
        Initializes the AiService with necessary infrastructure dependencies.
        """
        self.ai_provider = ai_provider
        self.cache_manager = cache_manager
        self.firestore_client = firestore_client
        self.translation_client = translation_client

    def _sanitize_input(self, text: str) -> str:
        """
        Basic sanitization of user input.
        """
        return text.strip()

    async def ask_question(self, user_id: str, question: str) -> Dict[str, Any]:
        """
        Optimized pipeline: Routing -> Cache -> Translation -> RAG -> Generation -> Analytics.
        """
        import time
        sanitized_question = self._sanitize_input(question)
        if not sanitized_question:
            raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
        # 1. High-speed Cache check FIRST (Efficiency)
        cached_answer = await self.cache_manager.get(sanitized_question)
        if cached_answer:
            return await self._handle_cache_hit(user_id, sanitized_question, cached_answer)

        # 2. Query Routing (Skip RAG for greetings)
        query_type = self._route_query(sanitized_question)
        
        # 3. Multi-language detection
        source_lang = await self.translation_client.detect_language(sanitized_question)
        process_question = sanitized_question
        if source_lang and source_lang != "en":
            process_question = await self.translation_client.translate_text(sanitized_question, target_language="en")

        try:
            # 4. Context Retrieval (RAG) - Only if informational
            context = "General election guidance."
            if query_type == "informational":
                query_vector = await self.ai_provider.generate_embedding(process_question)
                relevant_facts = await self.firestore_client.query_knowledge_base(query_vector)
                if relevant_facts:
                    context = "\n".join([f"- {fact}" for fact in relevant_facts])

            # 5. Grounded Generation (Vertex AI Search Grounding enabled by default in provider)
            start_time = time.time()
            system_instruction = self._get_system_instruction(context)
            response_text = await self.ai_provider.generate_response(
                prompt=process_question, 
                system_instruction=system_instruction,
                response_schema=StructuredAIResponse
            )
            latency = time.time() - start_time
            
            # 6. Parse & Localize
            data = self._parse_ai_response(response_text)
            final_answer = data.answer
            if source_lang and source_lang != "en":
                final_answer = await self.translation_client.translate_text(data.answer, target_language=source_lang)
            
            # 7. Persistence & Analytics
            await self._persist_interaction(user_id, sanitized_question, final_answer, data, source_lang, latency)
            await self.cache_manager.set(sanitized_question, final_answer)
            
            return {
                "answer": final_answer,
                "reasoning": data.reasoning,
                "confidence_score": data.confidence_score,
                "source": "gemini",
                "type": query_type,
                "structured": True,
                "language": source_lang or "en"
            }
        except Exception as e:
            logger.error(f"AiService Error: {str(e)}", extra={"user_id": user_id})
            raise HTTPException(status_code=500, detail="Internal AI error.") from e

    def _route_query(self, text: str) -> str:
        """Categorizes query to optimize resource usage."""
        greetings = {"hi", "hello", "hey", "namaste", "who are you"}
        if any(word in text.lower() for word in greetings) and len(text.split()) < 5:
            return "conversational"
        return "informational"

    def _get_system_instruction(self, context: str) -> str:
        return (
            "You are BallotBuddy AI, the official intelligent assistant for the Indian Election system. "
            "Your tone is helpful, neutral, and strictly informative. "
            "ONLY answer election-related queries. For others, politely decline.\n\n"
            f"VERIFIED CONTEXT:\n{context}"
        )

    def _parse_ai_response(self, text: str) -> StructuredAIResponse:
        try:
            return StructuredAIResponse.model_validate_json(text)
        except Exception:
            return StructuredAIResponse(answer=text, reasoning="Standard AI reasoning applied.", confidence_score=0.8)

    async def _handle_cache_hit(self, user_id: str, question: str, answer: str) -> Dict[str, Any]:
        logger.info(f"Cache hit for user {user_id}")
        await self.firestore_client.log_analytics({"user_id": user_id, "question": question, "latency": 0.0, "source": "cache"})
        await self.firestore_client.save_user_query(user_id, question, {"answer": answer})
        return {
            "answer": answer,
            "confidence_score": 1.0,
            "reasoning": "This response was served from the high-speed semantic cache.",
            "source": "cache",
            "type": "informational",
            "structured": True,
            "language": "en"
        }

    async def _persist_interaction(self, user_id, question, answer, data, lang, latency):
        await self.firestore_client.log_analytics({
            "user_id": user_id, "question": question, "latency": latency,
            "confidence_score": data.confidence_score, "language": lang or "en"
        })
        await self.firestore_client.save_user_query(user_id, question, {"answer": answer})

    async def analyze_document(self, user_id: str, file_bytes: bytes, mime_type: str) -> Dict[str, Any]:
        """
        Analyzes a document using Gemini Vision and provides registration guidance.
        """
        try:
            from google.genai import types
            
            prompt_parts = [
                types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
                "Analyze this Indian voter document. Identify the document type (EPIC Card, Voter Slip, or Aadhaar). "
                "Extract the name and constituency if visible. "
                "Tell the user if this document is sufficient for voting on election day and what the next steps are "
                "for verification or registration if any information seems missing. Be encouraging and helpful."
            ]
            
            answer = await self.ai_provider.generate_response(
                prompt=prompt_parts,
                system_instruction="You are an expert ECI documentation assistant."
            )
            
            return {
                "analysis": answer,
                "document_type": "detected",
                "confidence": 0.85
            }
        except Exception as e:
            logger.error(f"AiService analyze_document Error: {str(e)}", extra={"user_id": user_id})
            raise HTTPException(
                status_code=500,
                detail="Failed to analyze document. Please ensure the image is clear."
            ) from e
