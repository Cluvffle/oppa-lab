"""
챠밍 백엔드 설정 (환경변수 기반)
"""

from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_ignore_empty=True,
    )

    # ===== Application =====
    APP_NAME: str = "Charming"
    APP_VERSION: str = "0.1.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    RELOAD: bool = True
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    ENV: Literal["development", "staging", "production"] = "development"

    # ===== CORS =====
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    # ===== Security =====
    INTERNAL_API_SECRET: str = Field(
        default="dev-secret-change-me",
        description="Next.js BFF ↔ FastAPI 통신 시크릿",
    )
    JWT_SECRET: str = Field(
        default="dev-jwt-secret-change-me",
        description="JWT 서명 시크릿",
    )

    # ===== Supabase =====
    SUPABASE_URL: str = Field(default="", description="Supabase 프로젝트 URL")
    SUPABASE_ANON_KEY: str = Field(default="", description="Supabase Anon Key")
    SUPABASE_SERVICE_KEY: str = Field(default="", description="Supabase Service Role Key")

    # ===== OpenAI =====
    OPENAI_API_KEY: str = Field(default="", description="OpenAI API Key (Whisper + GPT)")
    OPENAI_MODEL: str = Field(default="gpt-4o-mini", description="리포트 생성용 모델")

    # ===== Storage =====
    STORAGE_DIR: str = Field(
        default_factory=lambda: str(PROJECT_ROOT / "storage"),
        description="로컬 파일 저장 경로 (녹음/이미지 임시)",
    )

    # ===== Payment (Toss) =====
    TOSS_SECRET_KEY: str = Field(default="", description="토스페이먼츠 시크릿 키")
    TOSS_CLIENT_KEY: str = Field(default="", description="토스페이먼츠 클라이언트 키")

    # ===== Feature Flags =====
    ENABLE_WEBRTC: bool = True
    ENABLE_CREATOR_REWARDS: bool = True


settings = AppSettings()
