from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def get_forecast():
    return {"message": "Forecast endpoint stub"}
