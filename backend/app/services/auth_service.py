from datetime import datetime
from uuid import uuid4

from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.db.collections import get_users_collection
from app.schemas.user_schema import TokenResponse, UserCreate, UserPublic


async def register_user(payload: UserCreate) -> UserPublic:
	users_collection = get_users_collection()
	email = payload.email.lower()

	existing_user = await users_collection.find_one({"email": email})
	if existing_user:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="User with this email already exists",
		)

	user_doc = {
		"company_name": payload.company_name,
		"email": email,
		"password_hash": hash_password(payload.password),
		"tenant_id": str(uuid4()),
		"role": payload.role,
		"created_at": datetime.utcnow(),
	}

	try:
		insert_result = await users_collection.insert_one(user_doc)
	except DuplicateKeyError:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="User with this email already exists",
		)

	created_user = await users_collection.find_one({"_id": insert_result.inserted_id})
	if not created_user:
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail="Failed to load created user",
		)

	return UserPublic(
		id=str(created_user["_id"]),
		company_name=created_user["company_name"],
		email=created_user["email"],
		tenant_id=created_user["tenant_id"],
		role=created_user["role"],
		created_at=created_user["created_at"],
	)


async def login_user(email: str, password: str) -> TokenResponse:
	users_collection = get_users_collection()
	user_doc = await users_collection.find_one({"email": email.lower()})

	if not user_doc or not verify_password(password, user_doc["password_hash"]):
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)

	access_token = create_access_token(
		{
			"sub": str(user_doc["_id"]),
			"tenant_id": user_doc["tenant_id"],
			"email": user_doc["email"],
			"role": user_doc["role"],
		}
	)

	return TokenResponse(access_token=access_token)
