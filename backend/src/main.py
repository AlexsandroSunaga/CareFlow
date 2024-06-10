from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.router import api_router
from src.config.manager import get_settings
from src.repository.database import async_session
from src.repository.events import init_database_tables
from src.repository.seed import seed_demo


@asynccontextmanager
async def lifespan(_app: FastAPI):
    settings = get_settings()
    Path("data").mkdir(parents=True, exist_ok=True)
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(settings.redacted_dir).mkdir(parents=True, exist_ok=True)
    await init_database_tables()
    async with async_session() as db:
        await seed_demo(db)
    yield


def create_application() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=settings.api_prefix)
    return app


backend_app = create_application()
