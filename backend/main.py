"""
사이다 (Cider) FastAPI 진입점
개발 참조: .claude/skills/ 아래 모든 SKILL.md
"""

from dotenv import load_dotenv

load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger, setup_logging
from app.realtime.signaling import asgi_app as signaling_app

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작 · 종료 라이프사이클 훅"""
    logger.info("application_startup", app=settings.APP_NAME, env=settings.ENV)
    # TODO: Supabase 클라이언트 초기화
    # TODO: OpenAI/Whisper 클라이언트 초기화
    # TODO: WebRTC 시그널링 서버 초기화
    yield
    logger.info("application_shutdown")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 라우터 등록 (Phase 2에서 추가)
    # from app.routers import auth, users, creators, calls, reports, emergency, feed, community
    # app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    # ...

    @app.get("/health")
    async def health():
        return {
            "status": "ok",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "env": settings.ENV,
        }

    @app.get("/")
    async def root():
        return {
            "message": "사이다 API 서버",
            "docs": "/docs",
            "concept": ".claude/skills/concept/SKILL.md",
        }

    # WebRTC 시그널링 (Socket.IO) 마운트 → ws://host/socket.io
    app.mount("/socket.io", signaling_app)

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.RELOAD,
    )
