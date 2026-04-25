"""
Authentication endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password, get_password_hash
from app.db.session import get_db
from app.core.security import api_key_auth
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
)
from app.models.user import User

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint."""
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.username})
    return LoginResponse(access_token=access_token, token_type="bearer")


@router.post("/register", response_model=RegisterResponse, dependencies=[Depends(api_key_auth)])
def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """Register new user endpoint."""
    # Check if user already exists
    existing_user = (
        db.query(User)
        .filter(
            (User.username == register_data.username) |
            (User.email == register_data.email)
        )
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered",
        )

    # Create new user
    hashed_password = get_password_hash(register_data.password)
    new_user = User(
        username=register_data.username,
        email=register_data.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return RegisterResponse(
        message="User created successfully", username=new_user.username
    )
