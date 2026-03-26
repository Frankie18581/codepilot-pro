import logging
logger = logging.getLogger(__name__)
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..models.schemas import ChatRequest, ChatResponse
from ..services.chat_service import chat_service
import json
import asyncio

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    最简对话入口，支持流式输出 (阶段一)
    """
    messages = [{"role": "user", "content": request.message}]
    if request.history:
        # 将历史记录拼接到当前消息前
        messages = [{"role": msg.role, "content": msg.content} for msg in request.history] + messages
    
    async def event_generator():
        try:
            async for chunk in chat_service.get_stream_response(messages):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            logger.error(f"Streaming Error: {error_trace}")
            yield f"data: {json.dumps({'error': str(e), 'details': 'Check backend logs for full traceback'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/health")
async def health():
    return {"status": "healthy"}
