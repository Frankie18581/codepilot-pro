# CodePilot Pro

> AI-powered coding assistant with multi-model support, built with LangChain + LangGraph + FastAPI.

## Features

- **Multi-Model AI Chat**: Supports DeepSeek and other LLM providers via LangChain
- **Streaming Responses**: Real-time token streaming with SSE (Server-Sent Events)
- **Conversation Management**: Persistent chat history with PostgreSQL backend
- **RESTful API**: FastAPI-based backend with async support
- **Docker Ready**: Containerized deployment with Docker + WSL2 support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend Framework** | FastAPI (Python 3.11) |
| **AI/LLM** | LangChain + LangGraph |
| **Database** | PostgreSQL + SQLAlchemy (async) |
| **Migration** | Alembic |
| **Containerization** | Docker + Docker Compose |

## Project Structure

```
codepilot-pro/
├── backend/
│   ├── app/
│   │   ├── api/chat_routes.py       # Chat API endpoints
│   │   ├── clients/deepseek_client.py # LLM client integration
│   │   ├── core/config.py           # Configuration management
│   │   ├── core/security.py         # Auth & security
│   │   ├── db/models.py             # SQLAlchemy models
│   │   ├── db/repository/           # Data access layer
│   │   └── main.py                  # FastAPI entry point
│   ├── alembic/                     # Database migrations
│   └── Dockerfile
├── DOCKER_WSL_FIX.md                # WSL2 Docker setup guide
└── README.md
```

## Getting Started

```bash
# Start with Docker
docker-compose up -d

# Or run locally
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

## License

MIT
