from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Database ──
    DATABASE_URL: str = "sqlite+aiosqlite:///./gigshield.db"

    # ── Security ──
    SECRET_KEY: str = "gigshield-super-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── External APIs ──
    OPENWEATHERMAP_API_KEY: str = ""
    AQICN_API_TOKEN: str = ""

    # ── App ──
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    DEBUG: bool = True

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
