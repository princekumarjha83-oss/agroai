from typing import List, Optional
from fastapi import APIRouter, Query
from app.models.schemas import SchemeResponse, EligibilityCheckRequest, EligibilityCheckResponse
from app.services.schemes_service import get_all_schemes, evaluate_scheme_eligibility

router = APIRouter(prefix="/schemes", tags=["Government Welfare Schemes"])

@router.get("", response_model=List[SchemeResponse])
async def list_schemes(category: Optional[str] = Query(None)):
    """Retrieves verified government schemes with official DBT links."""
    return get_all_schemes(category=category)

@router.post("/eligibility", response_model=EligibilityCheckResponse)
async def check_eligibility(req: EligibilityCheckRequest):
    """Evaluates farmer criteria against verified central schemes."""
    return evaluate_scheme_eligibility(req)
