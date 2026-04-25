"""
Image processing utilities.
"""

import aiofiles
from pathlib import Path
from PIL import Image
from fastapi import UploadFile


class ImageProcessor:
    """Image processing and management utility."""

    MAX_SIZE = (1200, 1200)  # Maximum image dimensions
    QUALITY = 85  # JPEG quality
    ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}

    async def save_and_process_image(
        self, file: UploadFile, filename: str, upload_dir: str
    ) -> str:
        """Save and process uploaded image."""
        # Ensure upload directory exists
        upload_path = Path(upload_dir)
        upload_path.mkdir(parents=True, exist_ok=True)

        # Full file path
        file_path = upload_path / filename

        # Save uploaded file temporarily
        temp_path = file_path.with_suffix(f".temp{file_path.suffix}")

        try:
            # Save uploaded file
            async with aiofiles.open(temp_path, "wb") as buffer:
                content = await file.read()
                await buffer.write(content)

            # Process image with PIL
            with Image.open(temp_path) as img:
                # Convert to RGB if necessary
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                # Resize if too large
                if img.size[0] > self.MAX_SIZE[0] or img.size[1] > self.MAX_SIZE[1]:
                    img.thumbnail(self.MAX_SIZE, Image.Resampling.LANCZOS)

                # Save optimized image
                save_format = (
                    "JPEG" if file_path.suffix.lower() in [".jpg", ".jpeg"] else "PNG"
                )
                img.save(
                    file_path, format=save_format, quality=self.QUALITY, optimize=True
                )

            # Remove temporary file
            if temp_path.exists():
                temp_path.unlink()

            return str(file_path)

        except Exception as e:
            # Clean up on error
            if temp_path.exists():
                temp_path.unlink()
            if file_path.exists():
                file_path.unlink()
            raise e

    async def delete_image(self, filename: str, upload_dir: str) -> bool:
        """Delete an image file."""
        file_path = Path(upload_dir) / filename

        if file_path.exists() and file_path.is_file():
            try:
                file_path.unlink()
                return True
            except Exception:
                return False
        return False

    def validate_image_format(self, file: UploadFile) -> bool:
        """Validate if uploaded file is a supported image format."""
        if not file.content_type:
            return False

        return file.content_type.startswith("image/")

    def get_image_info(self, file_path: str) -> dict:
        """Get image information."""
        try:
            with Image.open(file_path) as img:
                return {
                    "format": img.format,
                    "mode": img.mode,
                    "size": img.size,
                    "width": img.size[0],
                    "height": img.size[1],
                }
        except Exception:
            return {}
