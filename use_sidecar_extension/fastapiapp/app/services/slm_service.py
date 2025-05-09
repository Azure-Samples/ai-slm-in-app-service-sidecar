import json
import logging
import os
from typing import AsyncIterable, Dict, Any
import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class SLMService:
    def __init__(self):
        self.api_url = 'http://localhost:11434/v1/chat/completions'
        
    async def stream_chat_completions(self, prompt: str) -> AsyncIterable[str]:
        """
        Stream chat completions from the SLM API
        """
        request_payload = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            "stream": True,
            "cache_prompt": False,
            "n_predict": 2048  # Increased token limit to allow longer responses
        }
        
        async with httpx.AsyncClient() as client:
            try:
                async with client.stream(
                    "POST", 
                    self.api_url,
                    json=request_payload,
                    headers={"Content-Type": "application/json"},
                    timeout=30.0
                ) as response:
                    if response.status_code != 200:
                        error_detail = await response.aread()
                        logger.error(f"API request failed with status {response.status_code}: {error_detail}")
                        raise HTTPException(status_code=response.status_code, 
                                           detail="Failed to get response from language model")
                    
                    async for line in response.aiter_lines():
                        if not line or line == "[DONE]":
                            continue
                        
                        if line.startswith("data: "):
                            line = line.replace("data: ", "").strip()
                            
                        try:
                            json_obj = json.loads(line)
                            if "choices" in json_obj and len(json_obj["choices"]) > 0:
                                delta = json_obj["choices"][0].get("delta", {})
                                content = delta.get("content")
                                if content:
                                    yield content
                        except json.JSONDecodeError:
                            logger.warning(f"Failed to parse JSON from line: {line}")
                            continue
            
            except httpx.RequestError as exc:
                logger.error(f"Error while requesting {exc.request.url}: {str(exc)}")
                raise HTTPException(status_code=503, detail="Service unavailable: cannot connect to language model API")