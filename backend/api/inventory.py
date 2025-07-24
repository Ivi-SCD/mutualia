from fastapi import APIRouter
from data.companies import companies_db
from datetime import datetime
from data.wastes import wastes_db

router = APIRouter()

@router.get("/inventory/real-time")
async def get_real_time_inventory():
    inventory = []
    for waste in wastes_db:
        company = next(c for c in companies_db if c["id"] == waste["company_id"])
        interested_companies = [c["name"] for c in companies_db 
                              if c["id"] != waste["company_id"] and c["type"] in ["consumidora", "ambas"]][:2]
        
        inventory.append({
            "waste": waste,
            "company": company,
            "interested_companies": interested_companies,
            "last_update": datetime.now(),
            "status": "disponível" if waste["available"] else "reservado"
        })
    
    return inventory
