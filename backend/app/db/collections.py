from motor.motor_asyncio import AsyncIOMotorCollection

from app.db.mongo import get_database


def get_users_collection() -> AsyncIOMotorCollection:
	return get_database()["users"]


def get_metrics_collection() -> AsyncIOMotorCollection:
	return get_database()["metrics"]


def get_incidents_collection() -> AsyncIOMotorCollection:
	return get_database()["incidents"]
