from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def get_models():
    return {"message": "Models endpoint stub"}
