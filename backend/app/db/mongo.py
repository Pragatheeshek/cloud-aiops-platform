from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
	global client, database
	client = AsyncIOMotorClient(settings.MONGO_URI)
	database = client[settings.MONGO_DB_NAME]

	await database["users"].create_index("email", unique=True)
	await database["users"].create_index("tenant_id")
	await database["metrics"].create_index("tenant_id")
	await database["metrics"].create_index("timestamp")
	await database["incidents"].create_index("tenant_id")
	await database["incidents"].create_index("created_at")
	await database["incidents"].create_index("status")
	await database["incidents"].create_index("resolved_at")


async def close_mongo_connection() -> None:
	global client, database
	if client is not None:
		client.close()
	client = None
	database = None


def get_database() -> AsyncIOMotorDatabase:
	if database is None:
		raise RuntimeError("MongoDB is not connected.")
	return database
