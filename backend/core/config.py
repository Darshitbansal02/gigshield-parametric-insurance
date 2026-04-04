from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Database ──
    DATABASE_URL: str  # Must be provided in .env (Format: postgresql+asyncpg://user:pass@host/db)

    # ── Security ──
    SECRET_KEY: str = "gigshield-super-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── External APIs ──
    OPENWEATHERMAP_API_KEY: str = ""
    AQICN_API_TOKEN: str = ""

    # ── App ──
    CORS_ORIGINS: str  # Must be provided in .env (Comma-separated list of allowed URLs)
    DEBUG: bool = False

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        import os
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        env_file_encoding = "utf-8"


settings = Settings()
