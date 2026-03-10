from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Table, Text, Numeric
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Many-to-Many association table mapping Parts to Equipment Platforms
part_equipment_association = Table(
    'part_equipment_link', Base.metadata,
    Column('part_id', Integer, ForeignKey('parts.id'), primary_key=True),
    Column('equipment_id', Integer, ForeignKey('equipment_platforms.id'), primary_key=True)
)

class EquipmentPlatform(Base):
    """
    Overarching Machinery/Drifter Platform (e.g., Underground Rock Drifters).
    Stores technical tolerances and functional data.
    """
    __tablename__ = 'equipment_platforms'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True) # e.g., "Sandvik HLX5", "Epiroc COP 1838"
    category = Column(String(100), nullable=False) # e.g., "Underground Rock Drifter"
    
    # Technical Specifications
    impact_power_kw = Column(Float, nullable=True) # e.g., 20.0
    max_hydraulic_pressure_bar = Column(Integer, nullable=True) # e.g., 220
    rotation_torque_nm = Column(Integer, nullable=True) # e.g., 975
    weight_kg = Column(Float, nullable=True) # e.g., 210.0
    
    # Relationships
    compatible_parts = relationship('Part', secondary=part_equipment_association, back_populates='compatible_platforms')

    def __repr__(self):
        return f"<EquipmentPlatform(name='{self.name}', category='{self.category}')>"


class Part(Base):
    """
    Specific aftermarket or OEM component.
    Stores highly technical metallurgical data and procurement pricing.
    """
    __tablename__ = 'parts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False) # e.g., "Rotation Chuck Subassembly"
    
    # Core Identifyers
    oem_reference_number = Column(String(100), nullable=False, index=True, unique=True) # Indexed for high-speed search
    alternate_oem_numbers = Column(Text, nullable=True)
    
    # Engineering & Fabrication Data
    metallurgy_standard = Column(String(100), nullable=True) # e.g., "18CrNiMo7-6" or "EN24"
    heat_treatment_type = Column(String(100), nullable=True)
    weight_kg = Column(Float, nullable=True)
    
    # Procurement & Pricing (Using Numeric for precise financial data)
    estimated_oem_price = Column(Numeric(10, 2), nullable=True) 
    aftermarket_price = Column(Numeric(10, 2), nullable=True)
    
    # Supply Chain
    manufacturing_hub = Column(String(100), nullable=True) # e.g., "Turkey", "India"
    is_iso_certified = Column(Boolean, default=False)
    stock_status = Column(String(50), default="In Stock")
    
    # Relationships
    compatible_platforms = relationship('EquipmentPlatform', secondary=part_equipment_association, back_populates='compatible_parts')

    def __repr__(self):
        return f"<Part(oem_ref='{self.oem_reference_number}', name='{self.name}')>"

# --- Database Migration / Setup Snippet ---
if __name__ == "__main__":
    from sqlalchemy import create_engine
    
    print("Initializing Database Engine...")
    # Using SQLite for local testing, easily swappable to PostgreSQL
    engine = create_engine('sqlite:///heavy_machinery.db', echo=True)
    
    print("Generating schema tables (Migrations)...")
    Base.metadata.create_all(engine)
    print("Schema successfully deployed to 'heavy_machinery.db'!")
