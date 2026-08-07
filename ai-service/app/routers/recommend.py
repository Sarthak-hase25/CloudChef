from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def get_recommend():
    return {"message": "Recommend endpoint stub"}
