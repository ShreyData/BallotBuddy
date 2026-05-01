import json
from fastapi import HTTPException
from app.infrastructure.ai_provider import AIProvider
from app.core.logging import logger

class MisinformationService:
    """
    Service class for checking claims against potential misinformation.
    """
    def __init__(self, ai_provider: AIProvider):
        self.ai_provider = ai_provider

    def _sanitize_input(self, text: str) -> str:
        """Basic sanitization of user input."""
        return text.strip()

    async def check_claim(self, claim: str) -> dict:
        """
        Verifies an election-related claim using AI.
        """
        sanitized_claim = self._sanitize_input(claim)
        
        if not sanitized_claim:
            raise HTTPException(status_code=400, detail="Claim cannot be empty.")
        
        if len(sanitized_claim) > 500:
            raise HTTPException(status_code=400, detail="Claim exceeds maximum length of 500 characters.")

        try:
            prompt = (
                f"Verify this claim about elections and explain truth: {sanitized_claim}. "
                "Respond in JSON format with two keys: 'is_true' (boolean) and 'explanation' (string)."
            )
            response_text = await self.ai_provider.generate_response(prompt)
            
            # Attempt to parse JSON from AI response
            try:
                # Basic JSON extraction in case AI adds preamble/postamble
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start != -1 and end != 0:
                    data = json.loads(response_text[start:end])
                    return {
                        "claim": sanitized_claim,
                        "is_true": data.get("is_true", False),
                        "explanation": data.get("explanation", "No explanation provided.")
                    }
            except json.JSONDecodeError:
                logger.warning(f"AI response was not valid JSON: {response_text}")
                
            # Fallback if parsing fails
            return {
                "claim": sanitized_claim,
                "is_true": False,
                "explanation": response_text
            }
        except Exception as e:
            logger.error(f"MisinformationService Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to verify claim: {str(e)}")
