from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
import json
import logging
from sse_starlette.sse import EventSourceResponse
from typing import AsyncIterable, Optional
import os

from app.models.product import Product
from app.services.slm_service import SLMService

router = APIRouter()
logger = logging.getLogger(__name__)

def get_slm_service() -> SLMService:
    return SLMService()

@router.get("/products")
async def get_products():
    """Get all available products"""
    return Product.get_all_products()

@router.get("/reactive-query")
async def process_query_reactive(
    product_id: int = Query(..., description="The ID of the product to query about"),
    message: str = Query(..., description="The user's message or query"),
    slm_service: SLMService = Depends(get_slm_service)
) -> EventSourceResponse:
    """
    Process a query about a product and stream the response
    """
    product = Product.get_product_by_id(product_id)
    if not product:
        logger.warning(f"Product not found with ID: {product_id}")
        return EventSourceResponse([f"data: Product not found\n\n"])
    
    # Create JSON payload
    query_data = {
        "user_message": message,
        "product_name": product.name,
        "product_description": product.description
    }
    
    prompt = json.dumps(query_data)
    
    async def event_generator():
        try:
            async for token in slm_service.stream_chat_completions(prompt):
                # Use non-breaking space to preserve formatting
                formatted_token = token.replace(" ", "\u00A0")
                yield {"data": formatted_token}
            
            # Send completion event
            yield {"event": "complete", "data": ""}
        except Exception as e:
            logger.error(f"Error streaming tokens to client: {str(e)}")
            yield {"event": "error", "data": str(e)}
    
    return EventSourceResponse(event_generator())