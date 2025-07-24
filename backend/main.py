from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, companies, wastes, matches, roi, dashboard, esg, inventory

app = FastAPI(title="ReciLoop API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(wastes.router)
app.include_router(matches.router)
app.include_router(roi.router)
app.include_router(dashboard.router)
app.include_router(esg.router)
app.include_router(inventory.router)

@app.get("/")
def read_root():
    return {"message": "ReciLoop API - Economia Circular em Suape"}

if __name__ == "__main__":
    FastAPI.uvicorn.run(app, host="0.0.0.0", port=8000)