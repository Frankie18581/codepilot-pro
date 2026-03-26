from openai import AsyncOpenAI
from ..core.config import settings

class DeepSeekClient:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.LLM_API_KEY,
            base_url=settings.LLM_BASE_URL
        )
        self.model = settings.LLM_MODEL

    async def chat_completion(self, messages, stream=True):
        return await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=stream
        )

deepseek_client = DeepSeekClient()
