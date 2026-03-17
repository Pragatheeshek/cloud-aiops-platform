import os


class Settings:
	APP_NAME: str = os.getenv("APP_NAME", "Cloud AIOps Platform API")
	APP_VERSION: str = os.getenv("APP_VERSION", "0.1.0")

	MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
	MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "cloud_aiops")

	JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-this-secret-in-production")
	JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
	ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


settings = Settings()
