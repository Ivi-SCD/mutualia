from fastapi import APIRouter, Depends
from core.security import get_current_user
from data.wastes import wastes_db 
from data.companies import companies_db
from datetime import datetime
from services.matching import calculate_match_score

router = APIRouter()

@router.get("/matches")
async def get_matches(current_user: dict = Depends(get_current_user)):
    generated_matches = []
    company_id = current_user["company_id"]
    
    for waste in wastes_db:
        for company in companies_db:
            if company["id"] != waste["company_id"] and company["type"] in ["consumidora", "ambas"]:
                score = calculate_match_score(waste, 
                    next(c for c in companies_db if c["id"] == waste["company_id"]),
                    company
                )
                
                if score > 70:
                    estimated_savings = waste["quantity"] * waste["price_per_unit"] * 0.8
                    
                    generated_matches.routerend({
                        "id": len(generated_matches) + 1,
                        "waste": waste,
                        "generator_company": next(c for c in companies_db if c["id"] == waste["company_id"]),
                        "consumer_company": company,
                        "score": score,
                        "estimated_savings": estimated_savings,
                        "status": "pendente",
                        "created_at": datetime.now()
                    })
    
    generated_matches.sort(key=lambda x: x["score"], reverse=True)
    return generated_matches