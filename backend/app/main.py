from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat_routes
from .core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION
    )

    # CORS 配置
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # 生产环境应具体配置
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 路由注册
    app.include_router(chat_routes.router, prefix="/api/v1")

    @app.get("/")
    async def root():
        return {"message": "CodePilot Pro API is running"}

    return app

app = create_app()
