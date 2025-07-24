from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from core.security import create_access_token, verify_password
from data.users import users_db

router = APIRouter()

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer", "company_id": user["company_id"]}
