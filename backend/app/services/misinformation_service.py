import json
from fastapi import HTTPException
from app.infrastructure.ai_provider import AIProvider
from app.core.logging import logger

from app.schemas.ai import MisinformationResult

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
        Verifies an election-related claim using AI with structured output.
        """
        sanitized_claim = self._sanitize_input(claim)
        
        if not sanitized_claim:
            raise HTTPException(status_code=400, detail="Claim cannot be empty.")
        
        if len(sanitized_claim) > 500:
            raise HTTPException(status_code=400, detail="Claim exceeds maximum length of 500 characters.")

        try:
            system_instruction = (
                "You are an expert fact-checker for Indian elections. Your task is to verify claims about "
                "ECI procedures, EVM security, voting rights, and candidate rules in India. "
                "Provide a clear boolean 'is_true' and a concise 'explanation' based on Indian law. "
                "Always remain objective and neutral."
            )
            
            response_text = await self.ai_provider.generate_response(
                prompt=f"Verify this claim: {sanitized_claim}",
                system_instruction=system_instruction,
                response_schema=MisinformationResult
            )
            
            # Parse validated JSON directly
            try:
                data = MisinformationResult.model_validate_json(response_text)
                return {
                    "claim": sanitized_claim,
                    "is_true": data.is_true,
                    "explanation": data.explanation
                }
            except Exception as e:
                logger.warning(f"Failed to validate AI structured response: {e}. Raw response: {response_text}")
                # Fallback in case of validation error
                return {
                    "claim": sanitized_claim,
                    "is_true": False,
                    "explanation": "Could not verify claim due to a processing error."
                }
        except Exception as e:
            logger.error(f"MisinformationService Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to verify claim: {str(e)}")
