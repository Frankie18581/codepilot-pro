from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models import Conversation, Message
from uuid import UUID

class ChatRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_conversation(self) -> Conversation:
        new_conv = Conversation()
        self.session.add(new_conv)
        await self.session.flush() # 立即获取 ID
        return new_conv

    async def add_message(self, conv_id: UUID, role: str, content: str) -> Message:
        new_msg = Message(conversation_id=conv_id, role=role, content=content)
        self.session.add(new_msg)
        await self.session.flush()
        return new_msg

    async def get_conversation_history(self, conv_id: UUID) -> list[Message]:
        result = await self.session.execute(
            select(Message)
            .where(Message.conversation_id == conv_id)
            .order_by(Message.created_at.asc())
        )
        return result.scalars().all()
