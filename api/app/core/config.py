from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CareFlow API"
    cors_origins: str = "http://localhost:3011,http://127.0.0.1:3011"
    database_url: str = "sqlite+aiosqlite:///./data/careflow.db"
    openai_api_key: str | None = None
    upload_dir: str = "./data/uploads"
    redacted_dir: str = "./data/redacted"
    jwt_secret: str = "careflow-dev-secret-change-in-production"

    class Config:
        env_file = ".env"


settings = Settings()
