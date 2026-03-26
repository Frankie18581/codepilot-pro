from typing import List, Dict, AsyncGenerator
from ..clients.deepseek_client import deepseek_client
from ..models.schemas import Message

class ChatService:
    async def get_stream_response(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """
        流式返回大模型结果
        """
        response = await deepseek_client.chat_completion(messages, stream=True)
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

chat_service = ChatService()
