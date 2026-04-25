"""
Home property endpoints.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.enums import AdvType, PriceType, PropertyType, ArmenianRegion, ArmenianCity, ForeignCountry, WorldRegionType, LocationType
from app.schemas.home import (
    HomeCreate,
    HomeUpdate,
    HomeFilter,
    HomesResponse,
    HomeCreateResponse,
    HomeUpdateResponse,
    HomeDeleteResponse,
    HomeBase,
    HomeActivationRequest,
)
from app.services.home_service import HomeService

router = APIRouter()


@router.get("/", response_model=HomesResponse)
def get_homes(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    city: Optional[str] = Query(None, description="Filter by city"),
    
    # Armenian location filters
    armenian_region: Optional[ArmenianRegion] = Query(
        None, description="Filter by Armenian region"
    ),
    armenian_city: Optional[ArmenianCity] = Query(
        None, description="Filter by Armenian city"
    ),
    
    # Foreign location filters
    world_region: Optional[WorldRegionType] = Query(
        None, description="Filter by world region"
    ),
    foreign_country: Optional[ForeignCountry] = Query(
        None, description="Filter by foreign country"
    ),
    
    price_min: Optional[int] = Query(None, ge=0, description="Minimum price filter"),
    price_max: Optional[int] = Query(None, ge=0, description="Maximum price filter"),
    price_type: Optional[PriceType] = Query(None, description="Filter by price type"),
    property_type: Optional[PropertyType] = Query(
        None, description="Filter by property type"
    ),
    rooms: Optional[int] = Query(None, description="Filter by number of rooms"),
    adv_type: Optional[AdvType] = Query(
        None, description="Filter by advertisement type"
    ),
    isHot: Optional[bool] = Query(None, description="Filter by hot properties"),
    is_active: Optional[bool] = Query(None, description="Filter by activation status"),
    location_type: Optional[LocationType] = Query(
        None, description="Filter by location type"
    ),
    db: Session = Depends(get_db),
):
    """Get homes with pagination and filters."""
    filters = HomeFilter(
        city=city,
        armenian_region=armenian_region,
        armenian_city=armenian_city,
        world_region=world_region,
        foreign_country=foreign_country,
        price_min=price_min,
        price_max=price_max,
        price_type=price_type,
        property_type=property_type,
        rooms=rooms,
        adv_type=adv_type,
        isHot=isHot,
        is_active=is_active,
        location_type=location_type,
    )

    result = HomeService.get_homes(db=db, skip=skip, limit=limit, filters=filters)
    return HomesResponse(**result)



@router.get("/{home_uuid}", response_model=HomeBase)
def get_home(home_uuid: str, db: Session = Depends(get_db)):
    """Get a specific home by UUID."""
    home = HomeService.get_home_by_uuid(db, home_uuid)
    if not home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )
    return home


@router.post("/", response_model=HomeCreateResponse)
def create_home(
    home: HomeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new home property."""
    new_home = HomeService.create_home(db=db, home=home)
    return HomeCreateResponse(message="Home created successfully", data=new_home)


@router.put("/{home_uuid}", response_model=HomeUpdateResponse)
def update_home(
    home_uuid: str,
    home_update: HomeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update an existing home property."""
    updated_home = HomeService.update_home(
        db=db, home_uuid=home_uuid, home_update=home_update
    )
    if not updated_home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )
    return HomeUpdateResponse(message="Home updated successfully", data=updated_home)


@router.delete("/{home_uuid}", response_model=HomeDeleteResponse)
def delete_home(
    home_uuid: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a home property."""
    success = HomeService.delete_home(db=db, home_uuid=home_uuid)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )
    return HomeDeleteResponse(
        message="Home deleted successfully", deleted_uuid=home_uuid
    )


@router.patch("/{home_uuid}/activate", response_model=HomeUpdateResponse)
def activate_home(
    home_uuid: str,
    activation_request: HomeActivationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Activate or deactivate a home property."""
    updated_home = HomeService.activate_home(
        db=db, home_uuid=home_uuid, is_active=activation_request.is_active
    )
    if not updated_home:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Home not found"
        )

    action = "activated" if activation_request.is_active else "deactivated"
    return HomeUpdateResponse(message=f"Home {action} successfully", data=updated_home)