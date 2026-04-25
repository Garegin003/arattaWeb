"""
Home property schemas.
"""

from typing import Optional, List
from pydantic import BaseModel, UUID4, validator

from app.models.enums import (
    PriceType,
    LocationType,
    WorldRegionType,
    AdvType,
    PropertyType,
    ArmenianRegion,
    ArmenianCity,
    ForeignCountry,
)


class HomeBase(BaseModel):
    """Base home schema."""

    uuid: UUID4
    adv_code: str
    img_uris: str
    adv_title: str
    adv_description: str
    price: int
    price_amd: Optional[int] = 0
    price_usd: Optional[int] = 0
    price_eur: Optional[int] = 0
    price_rub: Optional[int] = 0
    price_type: PriceType
    property_type: PropertyType
    adv_type: AdvType
    city: Optional[str] = None  # Free text city

    # Foreign or Armenia
    location_type: LocationType
    
    # Armenian location hierarchy (conditional)
    armenian_region: Optional[ArmenianRegion] = None
    armenian_city: Optional[ArmenianCity] = None
    
    # Foreign location hierarchy (conditional)
    world_region: Optional[WorldRegionType] = None
    foreign_country: Optional[ForeignCountry] = None
    
    address: str
    isHot: bool
    is_active: bool
    total_area: float
    grace_type: str
    rooms: int
    pet_policy: str
    bathroom_count: int
    ceiling_height: float
    floor: int
    total_floors: int
    renovation_type: str
    appliances: str
    hasElevator: bool
    isNewConstruction: bool
    hasBalcony: bool
    hasFurniture: bool
    includedUtiliies: str
    withPrepayment: bool

    class Config:
        from_attributes = True


class HomeCreate(BaseModel):
    """Schema for creating a home."""

    adv_code: str
    img_uris: str = ""
    adv_title: str
    adv_description: str
    price: int
    price_type: PriceType
    property_type: PropertyType = PropertyType.APARTMENT
    location_type: LocationType
    adv_type: AdvType
    city: Optional[str] = None
    
    # Armenian location hierarchy (for Armenian properties)
    armenian_region: Optional[ArmenianRegion] = None
    armenian_city: Optional[ArmenianCity] = None
    
    # Foreign location hierarchy (for foreign properties)
    world_region: Optional[WorldRegionType] = None
    foreign_country: Optional[ForeignCountry] = None
    
    address: str
    isHot: bool = False
    total_area: float
    grace_type: str
    rooms: int
    pet_policy: str
    bathroom_count: int
    ceiling_height: float
    floor: int
    total_floors: int
    renovation_type: str
    appliances: str
    hasElevator: bool
    isNewConstruction: bool
    hasBalcony: bool
    hasFurniture: bool
    includedUtiliies: str
    withPrepayment: bool

    @validator('armenian_region', 'armenian_city', always=True)
    def validate_armenian_fields(cls, v, values):
        """Validate that Armenian location fields are only used with ARMENIAN location type."""
        location_type = values.get('location_type')
        
        if v is not None and location_type != LocationType.ARMENIAN:
            raise ValueError('Armenian location fields can only be used with LocationType.ARMENIAN')
        
        return v

    @validator('world_region', 'foreign_country', always=True)
    def validate_foreign_fields(cls, v, values):
        """Validate that foreign location fields are only used with FOREIGN location type."""
        location_type = values.get('location_type')
        
        if v is not None and location_type != LocationType.FOREIGN:
            raise ValueError('Foreign location fields can only be used with LocationType.FOREIGN')
        
        return v

    @validator('armenian_region')
    def validate_armenian_region_required(cls, v, values):
        """Validate that armenian_region is required when location_type is ARMENIAN."""
        location_type = values.get('location_type')
        
        if location_type == LocationType.ARMENIAN and v is None:
            raise ValueError('armenian_region is required when location_type is ARMENIAN')
        
        return v

    @validator('world_region')
    def validate_world_region_required(cls, v, values):
        """Validate that world_region is required when location_type is FOREIGN."""
        location_type = values.get('location_type')
        
        if location_type == LocationType.FOREIGN and v is None:
            raise ValueError('world_region is required when location_type is FOREIGN')
        
        return v


class HomeUpdate(BaseModel):
    """Schema for updating a home."""

    adv_code: Optional[str] = None
    img_uris: Optional[str] = None
    adv_title: Optional[str] = None
    adv_description: Optional[str] = None
    price: Optional[int] = None
    price_type: Optional[PriceType] = None
    property_type: Optional[PropertyType] = None
    location_type: Optional[LocationType] = None
    adv_type: Optional[AdvType] = None
    city: Optional[str] = None
    
    # Armenian location hierarchy
    armenian_region: Optional[ArmenianRegion] = None
    armenian_city: Optional[ArmenianCity] = None
    
    # Foreign location hierarchy  
    world_region: Optional[WorldRegionType] = None
    foreign_country: Optional[ForeignCountry] = None
    
    address: Optional[str] = None
    isHot: Optional[bool] = None
    is_active: Optional[bool] = None
    total_area: Optional[float] = None
    grace_type: Optional[str] = None
    rooms: Optional[int] = None
    pet_policy: Optional[str] = None
    bathroom_count: Optional[int] = None
    ceiling_height: Optional[float] = None
    floor: Optional[int] = None
    total_floors: Optional[int] = None
    renovation_type: Optional[str] = None
    appliances: Optional[str] = None
    hasElevator: Optional[bool] = None
    isNewConstruction: Optional[bool] = None
    hasBalcony: Optional[bool] = None
    hasFurniture: Optional[bool] = None
    includedUtiliies: Optional[str] = None
    withPrepayment: Optional[bool] = None

    @validator('armenian_region', 'armenian_city', always=True)
    def validate_armenian_fields(cls, v, values):
        """Validate that Armenian location fields are only used with ARMENIAN location type."""
        location_type = values.get('location_type')
        
        if v is not None and location_type is not None and location_type != LocationType.ARMENIAN:
            raise ValueError('Armenian location fields can only be used with LocationType.ARMENIAN')
        
        return v

    @validator('world_region', 'foreign_country', always=True)
    def validate_foreign_fields(cls, v, values):
        """Validate that foreign location fields are only used with FOREIGN location type."""
        location_type = values.get('location_type')
        
        if v is not None and location_type is not None and location_type != LocationType.FOREIGN:
            raise ValueError('Foreign location fields can only be used with LocationType.FOREIGN')
        
        return v


class HomeFilter(BaseModel):
    """Schema for filtering homes."""

    city: Optional[str] = None
    
    # Armenian location filters
    armenian_region: Optional[ArmenianRegion] = None
    armenian_city: Optional[ArmenianCity] = None
    
    # Foreign location filters
    world_region: Optional[WorldRegionType] = None
    foreign_country: Optional[ForeignCountry] = None
    
    price_min: Optional[int] = None
    price_max: Optional[int] = None
    price_type: Optional[PriceType] = None
    property_type: Optional[PropertyType] = None
    rooms: Optional[int] = None
    adv_type: Optional[AdvType] = None
    isHot: Optional[bool] = None
    is_active: Optional[bool] = None
    location_type: Optional[LocationType] = None


class HomeActivationRequest(BaseModel):
    """Schema for home activation/deactivation."""

    is_active: bool


class HomesResponse(BaseModel):
    """Response schema for multiple homes."""

    results: List[HomeBase]
    offset: int
    limit: int
    count: int
    total_count: int


class HomeCreateResponse(BaseModel):
    """Response schema for home creation."""

    message: str
    data: HomeBase


class HomeUpdateResponse(BaseModel):
    """Response schema for home update."""

    message: str
    data: HomeBase


class HomeDeleteResponse(BaseModel):
    """Response schema for home deletion."""

    message: str
    deleted_uuid: str

