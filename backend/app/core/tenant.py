from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.db.collections import get_users_collection
from app.schemas.user_schema import UserPublic

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
	credentials_exception = HTTPException(
		status_code=status.HTTP_401_UNAUTHORIZED,
		detail="Could not validate credentials",
		headers={"WWW-Authenticate": "Bearer"},
	)

	try:
		payload = decode_access_token(token)
		user_id = payload.get("sub")
		tenant_id = payload.get("tenant_id")
		if not user_id or not tenant_id:
			raise credentials_exception
	except ValueError:
		raise credentials_exception

	users_collection = get_users_collection()
	try:
		object_id = ObjectId(user_id)
	except Exception:
		raise credentials_exception

	user_doc = await users_collection.find_one({"_id": object_id, "tenant_id": tenant_id})
	if user_doc is None:
		raise credentials_exception

	return UserPublic(
		id=str(user_doc["_id"]),
		company_name=user_doc["company_name"],
		email=user_doc["email"],
		tenant_id=user_doc["tenant_id"],
		role=user_doc["role"],
		created_at=user_doc["created_at"],
	)


async def get_current_tenant_id(current_user: UserPublic = Depends(get_current_user)) -> str:
	return current_user.tenant_id
