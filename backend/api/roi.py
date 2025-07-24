from fastapi import APIRouter, HTTPException, Depends
from models.schema import Company
from data.companies import companies_db

router = APIRouter()

@router.post("/roi/calculate")
async def calculate_roi(
    waste_type: str,
    volume: float,
    disposal_cost: float,
    market_price: float
):
    current_expense = volume * disposal_cost
    potential_revenue = volume * market_price
    potential_profit = potential_revenue - current_expense
    
    monthly_profit = potential_profit
    investment = 1500 
    payback_days = int((investment / monthly_profit) * 30) if monthly_profit > 0 else 0
    
    return {
        "waste_type": waste_type,
        "volume": volume,
        "disposal_cost": disposal_cost,
        "market_price": market_price,
        "potential_profit": potential_profit,
        "payback_days": max(7, payback_days),
        "roi_percentage": round((potential_profit / investment) * 100, 1) if investment > 0 else 0
    }
