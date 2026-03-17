from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token, verify_password
from app.db.collections import get_users_collection
from app.schemas.user_schema import TokenResponse, UserCreate, UserPublic
from app.services.auth_service import register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate) -> UserPublic:
	return await register_user(payload)


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
	users_collection = get_users_collection()
	email = form_data.username.lower()

	user_doc = await users_collection.find_one({"email": email})
	if not user_doc or not verify_password(form_data.password, user_doc["password_hash"]):
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
			headers={"WWW-Authenticate": "Bearer"},
		)

	access_token = create_access_token(
		{
			"sub": str(user_doc["_id"]),
			"tenant_id": user_doc["tenant_id"],
			"email": user_doc["email"],
			"role": user_doc["role"],
		}
	)

	return TokenResponse(access_token=access_token, token_type="bearer")
