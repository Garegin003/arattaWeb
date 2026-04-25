"""
Home model definition.
"""

import uuid
from sqlalchemy import Column, String, Boolean, UUID, Integer, Float
from sqlalchemy import Enum as SQLAlchemyEnum

from app.db.session import Base
from app.models.enums import (
    PriceType,
    WorldRegionType,
    LocationType,
    AdvType,
    PropertyType,
    ArmenianRegion,
    ArmenianCity,
    ForeignCountry,
)


class Home(Base):
    """Home property model."""

    __tablename__ = "homes"

    # Primary identifier
    uuid = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )

    # Basic information
    adv_code = Column(String, nullable=False, index=True)
    adv_title = Column(String, nullable=False, index=True)
    adv_description = Column(String, nullable=False)

    img_uris = Column(String, nullable=False)

    price = Column(Integer, nullable=False, index=True)
    price_type = Column(
        SQLAlchemyEnum(PriceType, name="price_type_enum"), nullable=False
    )
    property_type = Column(
        SQLAlchemyEnum(PropertyType, name="property_type_enum"),
        default=PropertyType.APARTMENT,
        nullable=False,
    )  # Property type (e.g., apartment, house, commercial)

    # Location and categorization
    location_type = Column(
        SQLAlchemyEnum(LocationType, name="location_type_enum"),
        default=LocationType.ARMENIAN,
        nullable=False,
    )  # Location type (e.g., Armenian, Foreign)

    adv_type = Column(
        SQLAlchemyEnum(AdvType, name="adv_type_enum"),
        default=AdvType.SALE,
        nullable=False,
    )  # Advertisement type (e.g., Rent, Sale)

    city = Column(String, nullable=True, index=True)  # Free text city for non-enum cases
    
    # Armenian location hierarchy
    armenian_region = Column(
        SQLAlchemyEnum(ArmenianRegion, name="armenian_region_enum"),
        nullable=True,
    )  # Armenian region (marz) - only for Armenian properties
    armenian_city = Column(
        SQLAlchemyEnum(ArmenianCity, name="armenian_city_enum"),
        nullable=True,
    )  # Armenian city - only for Armenian properties
    
    # Foreign location hierarchy  
    world_region = Column(
        SQLAlchemyEnum(WorldRegionType, name="world_region_enum"),
        nullable=True,
    )  # World region - only for foreign properties
    foreign_country = Column(
        SQLAlchemyEnum(ForeignCountry, name="foreign_country_enum"),
        nullable=True,
    )  # Foreign country - only for foreign properties

    address = Column(String, nullable=False)  # Full address
    isHot = Column(Boolean, default=False, index=True)  # Featured property
    is_active = Column(Boolean, default=False, index=True)  # Activation status

    # Property specifications
    total_area = Column(Float, nullable=False)  # Property area in square meters
    grace_type = Column(String, nullable=False)  # Construction type
    rooms = Column(Integer, nullable=False)  # Number of rooms
    pet_policy = Column(String, nullable=False)  # Pet policy
    bathroom_count = Column(Integer, nullable=False)  # Number of bathrooms
    ceiling_height = Column(Float, nullable=False)  # Ceiling height in meters
    floor = Column(Integer, nullable=False)  # Floor number
    total_floors = Column(Integer, nullable=False)  # Total floors in building
    renovation_type = Column(String, nullable=False)  # Renovation status
    appliances = Column(String, nullable=False)  # Home amenities

    # Features and amenities
    hasElevator = Column(Boolean, nullable=False)  # Has Elevator
    isNewConstruction = Column(Boolean, nullable=False)  # Newly constructed
    hasBalcony = Column(Boolean, nullable=False)  # Has Balcony
    hasFurniture = Column(Boolean, nullable=False)  # Utilities/Kitchen
    includedUtiliies = Column(String, nullable=False)  # Utility costs
    withPrepayment = Column(Boolean, nullable=False)  # Prepayment policy

    def __repr__(self):
        return f"<Home(uuid={self.uuid}, title='{self.adv_title}', price={self.price})>"
