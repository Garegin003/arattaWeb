"""
Home property service layer.
"""

import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.services.currency_service import get_home_with_price_amd

from app.models.home import Home
from app.schemas.home import HomeCreate, HomeUpdate, HomeFilter

import requests


class HomeService:
    """Service class for home operations."""

    @staticmethod
    def get_homes(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[HomeFilter] = None,
    ) -> dict:
        """Get homes with pagination and optional filters."""
        query = db.query(Home)
        currency_data = requests.get("http://www.floatrates.com/daily/amd.json").json()

        # Apply filters if provided
        if filters:
            if filters.city:
                query = query.filter(Home.city.ilike(f"%{filters.city}%"))
            
            # Armenian location filters
            if filters.armenian_region:
                query = query.filter(Home.armenian_region == filters.armenian_region)
            if filters.armenian_city:
                query = query.filter(Home.armenian_city == filters.armenian_city)
            
            # Foreign location filters
            if filters.world_region:
                query = query.filter(Home.world_region == filters.world_region)
            if filters.foreign_country:
                query = query.filter(Home.foreign_country == filters.foreign_country)
            if filters.price_min:
                query = query.filter(Home.price >= filters.price_min)
            if filters.price_max:
                query = query.filter(Home.price <= filters.price_max)
            if filters.price_type:
                query = query.filter(Home.price_type == filters.price_type)
            if filters.property_type:
                query = query.filter(Home.property_type == filters.property_type)
            if filters.rooms:
                query = query.filter(Home.rooms == filters.rooms)
            if filters.adv_type:
                query = query.filter(Home.adv_type == filters.adv_type)
            if filters.isHot is not None:
                query = query.filter(Home.isHot == filters.isHot)
            if filters.is_active is not None:
                query = query.filter(Home.is_active == filters.is_active)
            if filters.location_type:
                query = query.filter(Home.location_type == filters.location_type)

        total_count = query.count()
        homes = query.offset(skip).limit(limit).all()

        return {
            "results": [get_home_with_price_amd(home, currency_data) for home in homes],
            "offset": skip,
            "limit": limit,
            "count": len(homes),
            "total_count": total_count,
        }

    @staticmethod
    def get_home_by_uuid(db: Session, home_uuid: str) -> Optional[Home]:
        """Get home by UUID."""
        try:
            currency_data = requests.get("http://www.floatrates.com/daily/amd.json").json()
            uuid_obj = uuid.UUID(home_uuid)
            home = db.query(Home).filter(Home.uuid == uuid_obj).first() 
            if home:
                return get_home_with_price_amd(home, currency_data)
            return home
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format"
            )

    @staticmethod
    def get_home_db_instance(db: Session, home_uuid: str) -> Optional[Home]:
        """Get raw home database instance by UUID (for internal operations)."""
        try:
            uuid_obj = uuid.UUID(home_uuid)
            return db.query(Home).filter(Home.uuid == uuid_obj).first()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format"
            )

    @staticmethod
    def create_home(db: Session, home: HomeCreate) -> Home:
        """Create a new home."""
        db_home = Home(uuid=uuid.uuid4(), **home.dict())
        db.add(db_home)
        db.commit()
        db.refresh(db_home)
        
        # Return the converted schema object with currency info
        currency_data = requests.get("http://www.floatrates.com/daily/amd.json").json()
        return get_home_with_price_amd(db_home, currency_data)

    @staticmethod
    def update_home(
        db: Session, home_uuid: str, home_update: HomeUpdate
    ) -> Optional[Home]:
        """Update an existing home."""
        db_home = HomeService.get_home_db_instance(db, home_uuid)
        if not db_home:
            return None

        update_data = home_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_home, field, value)

        db.commit()
        db.refresh(db_home)
        
        # Return the converted schema object with currency info
        currency_data = requests.get("http://www.floatrates.com/daily/amd.json").json()
        return get_home_with_price_amd(db_home, currency_data)

    @staticmethod
    def delete_home(db: Session, home_uuid: str) -> bool:
        """Delete a home."""
        db_home = HomeService.get_home_db_instance(db, home_uuid)
        if not db_home:
            return False

        db.delete(db_home)
        db.commit()
        return True

    @staticmethod
    def add_home_image(db: Session, home_uuid: str, image_url: str) -> Optional[Home]:
        """Add image URL to home's image URIs list."""
        db_home = HomeService.get_home_db_instance(db, home_uuid)
        if not db_home:
            return None

        # Handle existing image URIs
        current_uris = db_home.img_uris.strip() if db_home.img_uris else ""
        
        # Filter out invalid URIs (like "string" or other placeholder text)
        if current_uris and not current_uris.startswith('/static/') and not current_uris.startswith('http'):
            current_uris = ""

        if current_uris:
            # Add new image to existing ones
            db_home.img_uris = f"{current_uris};{image_url}"
        else:
            # First image
            db_home.img_uris = image_url

        db.commit()
        db.refresh(db_home)
        return db_home

    @staticmethod
    def remove_home_image(
        db: Session, home_uuid: str, image_url: str
    ) -> Optional[Home]:
        """Remove specific image URL from home's image URIs list."""
        db_home = HomeService.get_home_db_instance(db, home_uuid)
        if not db_home:
            return None

        current_uris = db_home.img_uris.strip() if db_home.img_uris else ""

        if not current_uris:
            return db_home

        # Split URIs and remove the specified one, also filter out invalid URIs
        uri_list = [
            uri.strip() 
            for uri in current_uris.split(";") 
            if uri.strip() and (uri.strip().startswith('/static/') or uri.strip().startswith('http'))
        ]
        uri_list = [uri for uri in uri_list if uri != image_url]

        # Rejoin URIs
        db_home.img_uris = ";".join(uri_list) if uri_list else ""

        db.commit()
        db.refresh(db_home)
        return db_home

    @staticmethod
    def get_home_images(db: Session, home_uuid: str) -> List[str]:
        """Get list of all image URLs for a home."""
        db_home = HomeService.get_home_db_instance(db, home_uuid)
        if not db_home or not db_home.img_uris:
            return []

        return [
            uri.strip() 
            for uri in db_home.img_uris.split(";") 
            if uri.strip() and (uri.strip().startswith('/static/') or uri.strip().startswith('http'))
        ]

    @staticmethod
    def update_home_image(
        db: Session, home_uuid: str, image_url: str
    ) -> Optional[Home]:
        """Update home image URL (legacy method - now adds to list)."""
        return HomeService.add_home_image(db, home_uuid, image_url)

    @staticmethod
    def activate_home(db: Session, home_uuid: str, is_active: bool) -> Optional[Home]:
        """Activate or deactivate a home."""
        db_home = HomeService.get_home_db_instance(db, home_uuid)
        if not db_home:
            return None

        db_home.is_active = is_active
        db.commit()
        db.refresh(db_home)
        
        # Return the converted schema object with currency info
        currency_data = requests.get("http://www.floatrates.com/daily/amd.json").json()
        return get_home_with_price_amd(db_home, currency_data)
