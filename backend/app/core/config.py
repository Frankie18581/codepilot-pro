import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # 指示 Pydantic 从 .env 文件和环境变量中读取配置
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "../../../.env"), 
        env_file_encoding='utf-8',
        extra='ignore'
    )

    # 应用配置
    APP_NAME: str = "CodePilot Pro API"
    VERSION: str = "0.1.0"
    
    # LLM 配置 (将从环境变量或 .env 文件自动填充)
    LLM_API_KEY: str
    LLM_BASE_URL: str = "https://api.deepseek.com"
    LLM_MODEL: str = "deepseek-chat"
    
    # 数据库配置 (将从环境变量或 .env 文件自动填充)
    DATABASE_URL: str
    
    # 限流配置
    RATE_LIMIT_PER_MINUTE: int = 10

settings = Settings()
