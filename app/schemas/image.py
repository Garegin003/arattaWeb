"""
Image upload schemas.
"""

from typing import List
from pydantic import BaseModel


class ImageUploadResponse(BaseModel):
    """Response schema for single image upload."""

    message: str
    image_url: str
    file_path: str


class ImageDeleteResponse(BaseModel):
    """Response schema for image deletion."""

    message: str
    filename: str


class HomeWithImageCreateResponse(BaseModel):
    """Response schema for creating home with image."""

    message: str
    data: dict  # Will contain the home data
    image_url: str
    uploaded_filename: str


class HomeImageUpdateResponse(BaseModel):
    """Response schema for updating home image."""

    message: str
    data: dict  # Will contain the home data
    old_image_url: str
    new_image_url: str
    uploaded_filename: str


class MultipleImageUploadResponse(BaseModel):
    """Response schema for multiple image upload."""

    message: str
    uploaded_images: List[dict]
    failed_uploads: List[dict]
    total_uploaded: int
    total_failed: int


class HomeImagesResponse(BaseModel):
    """Response schema for getting home images."""

    home_uuid: str
    image_count: int
    image_urls: List[str]
    image_uris_string: str
