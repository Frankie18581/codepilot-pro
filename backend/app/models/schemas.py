from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from uuid import UUID

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None

class ChatResponse(BaseModel):
    reply: str
    conversation_id: UUID
    status: str = "success"
