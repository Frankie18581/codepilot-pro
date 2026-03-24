# backend/main.py FastAPI应用入口，提供RESTful API接口
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import logging

# 加载环境变量 
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="CodePilot Pro API", version="0.1.0")

# 配置 CORS，允许所有来源跨域访问，方便调试
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 LLM 客户端
client = OpenAI(
    api_key=os.getenv("LLM_API_KEY"),
    base_url=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
)
MODEL_NAME = os.getenv("LLM_MODEL", "gpt-3.5-turbo")

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Welcome to CodePilot API", "status": "running"}

@app.api_route("/{path_name:path}", methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])
async def catch_all(request: Request, path_name: str):
    logger.info(f"收到捕获请求: {request.method} /{path_name}")
    if path_name == "chat" and request.method == "POST":
        try:
            data = await request.json()
            message = data.get("message", "")
            # 模拟 HIC 判断
            is_ambiguous = "爬虫" in message or "系统" in message
            if is_ambiguous:
                response_text = f"[HIC 介入] 需求模糊：'{message}'"
            else:
                response_text = f"[HIC 直通] 清晰指令：'{message}'"
            return {"reply": response_text, "status": "success"}
        except Exception as e:
            return {"detail": str(e)}
            
    return {"detail": f"Method {request.method} on /{path_name} not allowed by catch-all", "status": "error"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "codepilot-backend"}