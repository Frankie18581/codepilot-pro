import logging
logger = logging.getLogger(__name__)
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, AIMessage
from ..models.schemas import ChatRequest, ChatResponse
from ..db.session import get_db_session
from ..db.repository.chat_repository import ChatRepository
from ..services.langgraph_service import langgraph_service
import json
import asyncio
from uuid import UUID

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db_session)):
    """
    企业级对话入口：基于 LangGraph 和数据库
    """
    repo = ChatRepository(db)
    
    # 1. 获取或创建会话
    if request.conversation_id:
        conv_id = request.conversation_id
    else:
        conv = await repo.create_conversation()
        conv_id = conv.id

    # 2. 将用户消息存入数据库 (实现持久化)
    await repo.add_message(conv_id, "user", request.message)

    # 3. 从数据库获取完整的历史记录 (不再由前端拼接，解决前端负担)
    db_history = await repo.get_conversation_history(conv_id)
    langchain_history = []
    for msg in db_history:
        if msg.role == "user":
            langchain_history.append(HumanMessage(content=msg.content))
        else:
            langchain_history.append(AIMessage(content=msg.content))

    # 4. 构造流式响应生成器
    async def event_generator():
        try:
            full_reply = ""
            # 使用 LangGraph 的 astream_events 或模型自身的 astream
            async for chunk in langgraph_service.model.astream(langchain_history):
                token = chunk.content
                full_reply += token
                yield f"data: {json.dumps({'content': token, 'conversation_id': str(conv_id)})}\n\n"
            
            # 5. 将 AI 完整的回复存入数据库
            await repo.add_message(conv_id, "assistant", full_reply)
            
            yield "data: [DONE]\n\n"
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            logger.error(f"Streaming Error: {error_trace}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/conversations/{conv_id}/history")
async def get_history(conv_id: UUID, db: AsyncSession = Depends(get_db_session)):
    repo = ChatRepository(db)
    history = await repo.get_conversation_history(conv_id)
    return history

@router.get("/health")
async def health():
    return {"status": "healthy"}
