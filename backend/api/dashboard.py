from fastapi import APIRouter, Depends
from core.security import get_current_user

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    return {
        "total_savings": 2400000, 
        "co2_avoided": 1234, 
        "matches_completed": 156,
        "materials_moved": 2850, 
        "monthly_trend": [
            {"month": "Jan", "savings": 180000},
            {"month": "Fev", "savings": 220000},
            {"month": "Mar", "savings": 350000},
            {"month": "Abr", "savings": 410000},
            {"month": "Mai", "savings": 520000},
            {"month": "Jun", "savings": 720000}
        ]
    }