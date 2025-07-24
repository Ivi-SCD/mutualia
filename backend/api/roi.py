from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Modelo de entrada (JSON enviado do frontend)
class ROICalculationInput(BaseModel):
    waste_type: str
    volume: float
    disposal_cost: float
    market_price: float

@router.post("/roi/calculate")
async def calculate_roi(data: ROICalculationInput):
    current_expense = data.volume * data.disposal_cost
    potential_revenue = data.volume * data.market_price
    potential_profit = potential_revenue - current_expense

    investment = 1500
    payback_days = int((investment / potential_profit) * 30) if potential_profit > 0 else 0

    return {
        "waste_type": data.waste_type,
        "volume": data.volume,
        "disposal_cost": data.disposal_cost,
        "market_price": data.market_price,
        "potential_profit": potential_profit,
        "payback_days": max(7, payback_days),
        "roi_percentage": round((potential_profit / investment) * 100, 1) if investment > 0 else 0
    }
