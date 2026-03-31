from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat_routes
from .core.config import settings
from .db.session import engine
from .db.models import Base

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION
    )

    @app.on_event("startup")
    async def startup_event():
        await create_tables()

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
