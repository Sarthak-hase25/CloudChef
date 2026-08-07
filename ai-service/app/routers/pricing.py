from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def get_pricing():
    return {"message": "Pricing endpoint stub"}
