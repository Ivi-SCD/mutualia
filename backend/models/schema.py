from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    email: str
    company_id: int

class Company(BaseModel):
    id: int
    name: str
    type: str
    logo: Optional[str] = None

class Waste(BaseModel):
    id: int
    name: str
    description: str
    quantity: float
    unit: str
    price_per_unit: float
    company_id: int
    available: bool = True
    category: str

class Match(BaseModel):
    id: int
    waste_id: int
    generator_company_id: int
    consumer_company_id: int
    score: float
    estimated_savings: float
    status: str
    created_at: datetime

class ESGScore(BaseModel):
    company_id: int
    company_name: str
    circular_score: float
    transactions_count: int
    total_savings: float
    co2_avoided: float

class ROICalculationInput(BaseModel):
    waste_type: str
    volume: float
    disposal_cost: float
    market_price: float
