from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="CKMS AI Service",
    description="AI/ML microservice for Cloud Kitchen Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Import Routers ───────────────────────────────────────────────────────────
from app.routers import forecast, pricing, recommend, analytics, explain, models

app.include_router(forecast.router,   prefix="/api/forecast",   tags=["Forecasting"])
app.include_router(pricing.router,    prefix="/api/pricing",    tags=["Dynamic Pricing"])
app.include_router(recommend.router,  prefix="/api/recommend",  tags=["Recommendations"])
app.include_router(analytics.router,  prefix="/api/analytics",  tags=["Analytics"])
app.include_router(explain.router,    prefix="/api/explain",    tags=["Explainability"])
app.include_router(models.router,     prefix="/api/models",     tags=["Model Comparison"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "CKMS AI Service"}
