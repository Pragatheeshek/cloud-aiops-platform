from fastapi import APIRouter, Depends

from app.core.tenant import get_current_tenant_id
from app.schemas.incident_schema import DashboardStats
from app.services.incident_service import get_dashboard_stats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardStats)
async def dashboard(tenant_id: str = Depends(get_current_tenant_id)) -> DashboardStats:
	return await get_dashboard_stats(tenant_id)
