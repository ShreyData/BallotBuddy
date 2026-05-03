from datetime import datetime, timezone

from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from google.cloud.firestore_v1.vector import Vector

from app.core.config import settings
from app.core.logging import logger


class FirestoreClient:
    """
    Firestore client for storing and retrieving user sessions.
    """
    def __init__(self):
        try:
            if settings.FIRESTORE_PROJECT_ID:
                self.db = firestore.AsyncClient(project=settings.FIRESTORE_PROJECT_ID)
            else:
                # Fallback to default credentials if project ID is not explicitly set
                self.db = firestore.AsyncClient()
            logger.info("Firestore client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {e}")
            self.db = None

    async def save_user_query(self, user_id: str, query: str, response: dict) -> None:
        """
        Saves a user query and the AI's response to a Firestore subcollection.
        """
        if not self.db:
            logger.warning("Firestore client is not initialized. Skipping save.")
            return

        try:
            # Main session document metadata
            doc_ref = self.db.collection("sessions").document(user_id)
            await doc_ref.set({"last_updated": datetime.now(timezone.utc)}, merge=True)
            
            # Subcollection for queries (unbounded growth handled correctly)
            query_data = {
                "question": query,
                "answer": response.get("answer", ""),
                "timestamp": datetime.now(timezone.utc)
            }
            await doc_ref.collection("queries").add(query_data)
            
            logger.info(f"Successfully saved query to subcollection for user: {user_id}")
        except Exception as e:
            logger.error(f"Error saving query to Firestore for user {user_id}: {e}")

    async def log_analytics(self, analytics_data: dict) -> None:
        """
        Logs detailed query analytics to a central collection.
        """
        if not self.db:
            return
        try:
            await self.db.collection("query_logs").add({
                **analytics_data,
                "timestamp": datetime.now(timezone.utc)
            })
        except Exception as e:
            logger.error(f"Error logging analytics: {e}")

    async def get_trending_topics(self, limit: int = 5) -> list[dict]:
        """
        Retrieves common queries to simulate trending topics.
        """
        if not self.db:
            return []
        try:
            # Simple simulation: get last 50 queries and return them as 'trending'
            docs = self.db.collection("query_logs").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(50).stream()
            questions = []
            async for doc in docs:
                data = doc.to_dict()
                if "question" in data:
                    questions.append(data["question"])
            
            # Count frequencies (simplified)
            from collections import Counter
            counts = Counter(questions)
            return [{"topic": topic, "count": count} for topic, count in counts.most_common(limit)]
        except Exception as e:
            logger.error(f"Error getting trending topics: {e}")
            return []

    async def get_user_history(self, user_id: str, limit: int = 20) -> list:
        """
        Retrieves the history of queries for a user from Firestore subcollection.
        """
        if not self.db:
            logger.warning("Firestore client is not initialized. Returning empty history.")
            return []

        try:
            queries_ref = self.db.collection("sessions").document(user_id).collection("queries")
            # Query the subcollection with ordering and limit
            docs = queries_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit).stream()
            
            history = []
            async for doc in docs:
                history.append(doc.to_dict())
            
            return history
        except Exception as e:
            logger.error(f"Error retrieving history from Firestore for user {user_id}: {e}")
            return []

    async def query_knowledge_base(self, query_vector: list[float], limit: int = 3) -> list[str]:
        """
        Queries the 'election_facts' collection using vector search to find relevant context.
        """
        if not self.db:
            return []

        try:
            collection = self.db.collection("election_facts")
            
            # Perform vector search
            vector_query = collection.find_nearest(
                vector_field="embedding",
                query_vector=Vector(query_vector),
                distance_measure=DistanceMeasure.COSINE,
                limit=limit
            )
            
            docs = vector_query.stream()
            results = []
            async for doc in docs:
                data = doc.to_dict()
                if "content" in data:
                    results.append(data["content"])
            
            return results
        except Exception as e:
            logger.error(f"Error querying knowledge base via vector search: {e}")
            return []
