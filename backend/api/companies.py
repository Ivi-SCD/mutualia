from fastapi import APIRouter, HTTPException
from models.schema import Company
from data.companies import companies_db

router = APIRouter()

@router.get("/companies", response_model=list[Company])
async def get_companies():
    return companies_db

@router.get("/companies/{company_id}")
async def get_company(company_id: int):
    company = next((c for c in companies_db if c["id"] == company_id), None)
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return company