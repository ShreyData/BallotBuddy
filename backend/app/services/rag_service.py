from typing import List, Optional
from app.infrastructure.ai_provider import AIProvider
from app.infrastructure.firestore_client import FirestoreClient
from app.core.logging import logger

class RAGService:
    """
    Service responsible for Retrieval-Augmented Generation context compilation.
    Encapsulates the logic for embedding generation and Firestore knowledge base queries.
    """
    def __init__(self, ai_provider: AIProvider, firestore_client: FirestoreClient):
        """
        Initializes the RAGService with required infrastructure.

        Args:
            ai_provider: Client for generating vector embeddings.
            firestore_client: Client for performing vector searches.
        """
        self.ai_provider = ai_provider
        self.firestore_client = firestore_client

    async def retrieve_context(self, query: str) -> str:
        """
        Generates an embedding for the query and retrieves relevant facts from Firestore.
        
        Args:
            query: The user's sanitized and translated question.
            
        Returns:
            A formatted string of context facts to ground the AI generation, or a default fallback.
        """
        try:
            # 1. Generate embedding for the query
            query_vector = await self.ai_provider.generate_embedding(query)
            
            # 2. Query the vector database (Firestore)
            relevant_facts = await self.firestore_client.query_knowledge_base(query_vector)
            
            if relevant_facts:
                return "\n".join([f"- {fact}" for fact in relevant_facts])
            
            return "General election guidance."
        except Exception as e:
            logger.error(f"RAGService Context Retrieval Error: {str(e)}")
            # Fail gracefully by providing generic context
            return "General election guidance."
