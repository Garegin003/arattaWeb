"""
API v1 router.
"""

from fastapi import APIRouter
from app.api.endpoints import homes, auth, images

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(homes.router, prefix="/homes", tags=["Homes"])
api_router.include_router(images.router, prefix="/images", tags=["Images"])
