"""
Image upload endpoints.
"""

import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_user
from app.db.session import get_db
from app.schemas.image import (
    ImageUploadResponse,
    ImageDeleteResponse,
    MultipleImageUploadResponse,
    HomeImagesResponse,
)
from app.services.home_service import HomeService
from app.utils.image_processor import ImageProcessor

router = APIRouter()


@router.post("/upload/{home_uuid}", response_model=ImageUploadResponse)
async def upload_home_image(
    home_uuid: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Upload an image for a specific home."""
    # Verify home exists
    home = HomeService.get_home_by_uuid(db, home_uuid)
    if not home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image"
        )

    try:
        # Process and save image
        image_processor = ImageProcessor()

        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        # Save and process image
        file_path = await image_processor.save_and_process_image(
            file=file, filename=unique_filename, upload_dir=settings.UPLOAD_DIR
        )

        # Generate image URL
        image_url = f"/static/images/{unique_filename}"

        # Update home with new image URL (adds to existing list)
        HomeService.add_home_image(db, home_uuid, image_url)

        return ImageUploadResponse(
            message="Image uploaded successfully",
            image_url=image_url,
            file_path=file_path,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}",
        )


@router.post("/upload-multiple/{home_uuid}", response_model=MultipleImageUploadResponse)
async def upload_multiple_images(
    home_uuid: str,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Upload multiple images for a specific home."""
    # Verify home exists
    home = HomeService.get_home_by_uuid(db, home_uuid)
    if not home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )

    uploaded_images = []
    failed_uploads = []

    for file in files:
        try:
            # Validate file type
            if not file.content_type or not file.content_type.startswith("image/"):
                failed_uploads.append(
                    {"filename": file.filename, "error": "File must be an image"}
                )
                continue

            # Process and save image
            image_processor = ImageProcessor()

            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"

            # Save and process image
            file_path = await image_processor.save_and_process_image(
                file=file, filename=unique_filename, upload_dir=settings.UPLOAD_DIR
            )

            # Generate image URL
            image_url = f"/static/images/{unique_filename}"

            # Add image to home's image list
            HomeService.add_home_image(db, home_uuid, image_url)

            uploaded_images.append(
                {
                    "original_filename": file.filename,
                    "image_url": image_url,
                    "file_path": file_path,
                }
            )

        except Exception as e:
            failed_uploads.append({"filename": file.filename, "error": str(e)})

    return MultipleImageUploadResponse(
        message=f"Uploaded {len(uploaded_images)} images successfully",
        uploaded_images=uploaded_images,
        failed_uploads=failed_uploads,
        total_uploaded=len(uploaded_images),
        total_failed=len(failed_uploads),
    )


@router.delete("/{home_uuid}/{filename}", response_model=ImageDeleteResponse)
async def delete_home_image(
    home_uuid: str,
    filename: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete an image from a specific home and remove from URI list."""
    # Verify home exists
    home = HomeService.get_home_by_uuid(db, home_uuid)
    if not home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )

    try:
        # Generate image URL to remove
        image_url = f"/static/images/{filename}"

        # Remove from home's image URI list
        updated_home = HomeService.remove_home_image(db, home_uuid, image_url)
        if not updated_home:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
            )

        # Delete physical file
        image_processor = ImageProcessor()
        file_deleted = await image_processor.delete_image(filename, settings.UPLOAD_DIR)

        return ImageDeleteResponse(
            message=f"Image removed from home and {'deleted from disk' if file_deleted else 'file not found on disk'}",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete image: {str(e)}",
        )


@router.get("/{home_uuid}", response_model=HomeImagesResponse)
async def get_home_images(home_uuid: str, db: Session = Depends(get_db)):
    """Get all images for a specific home."""
    # Verify home exists
    home = HomeService.get_home_by_uuid(db, home_uuid)
    if not home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )

    # Get image list
    image_urls = HomeService.get_home_images(db, home_uuid)

    return HomeImagesResponse(
        home_uuid=home_uuid,
        image_count=len(image_urls),
        image_urls=image_urls,
        image_uris_string=home.img_uris or "",
    )
