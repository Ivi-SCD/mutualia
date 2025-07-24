from fastapi import APIRouter

router = APIRouter()

@router.get("/esg/ranking")
async def get_esg_ranking():
    ranking = [
        {
            "position": 1,
            "company_id": 2,
            "company_name": "Cimpor",
            "circular_score": 95.2,
            "transactions_count": 48,
            "total_savings": 850000,
            "co2_avoided": 420
        },
        {
            "position": 2,
            "company_id": 3,
            "company_name": "Braskem",
            "circular_score": 88.7,
            "transactions_count": 35,
            "total_savings": 620000,
            "co2_avoided": 310
        },
        {
            "position": 3,
            "company_id": 1,
            "company_name": "Petrobras",
            "circular_score": 82.4,
            "transactions_count": 42,
            "total_savings": 720000,
            "co2_avoided": 380
        },
        {
            "position": 4,
            "company_id": 4,
            "company_name": "LafargeHolcim",
            "circular_score": 76.9,
            "transactions_count": 31,
            "total_savings": 480000,
            "co2_avoided": 250
        },
        {
            "position": 5,
            "company_id": 6,
            "company_name": "Termopernambuco",
            "circular_score": 71.3,
            "transactions_count": 28,
            "total_savings": 390000,
            "co2_avoided": 195
        }
    ]
    return ranking