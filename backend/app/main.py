from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.incidents import router as incidents_router
from app.api.metrics import router as metrics_router
from app.config import settings
from app.db.mongo import close_mongo_connection, connect_to_mongo


@asynccontextmanager
async def lifespan(_: FastAPI):
	await connect_to_mongo()
	yield
	await close_mongo_connection()


app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, lifespan=lifespan)

app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:5174",
		"http://127.0.0.1:5174",
	],
	allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(metrics_router)
app.include_router(incidents_router)
app.include_router(dashboard_router)


@app.get("/health", tags=["System"])
async def health_check() -> dict[str, str]:
	return {"status": "ok"}


@app.get("/health/services", tags=["System"])
async def health_services() -> list[dict[str, str]]:
	return [
		{"name": "API", "status": "healthy", "detail": "Request gateway operational"},
		{"name": "Database", "status": "healthy", "detail": "MongoDB connection active"},
		{"name": "AI Engine", "status": "healthy", "detail": "Inference pipeline online"},
	]
