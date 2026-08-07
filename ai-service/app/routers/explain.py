from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def get_explain():
    return {"message": "Explain endpoint stub"}
