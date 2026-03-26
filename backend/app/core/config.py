import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../../../.env"))

class Settings(BaseSettings):
    APP_NAME: str = "CodePilot Pro API"
    VERSION: str = "0.1.0"
    
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.deepseek.com")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "deepseek-chat")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 10

settings = Settings()
