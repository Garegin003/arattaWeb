"""
Authentication schemas.
"""

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Login request schema."""

    username: str
    password: str


class LoginResponse(BaseModel):
    """Login response schema."""

    access_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    """Register request schema."""

    username: str
    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    """Register response schema."""

    message: str
    username: str


class TokenData(BaseModel):
    """Token data schema."""

    username: str
