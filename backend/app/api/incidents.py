from fastapi import APIRouter, Depends

from app.core.tenant import get_current_tenant_id
from app.schemas.incident_schema import IncidentRecord
from app.services.incident_service import list_incidents_by_tenant

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.get("", response_model=list[IncidentRecord])
async def get_incidents(tenant_id: str = Depends(get_current_tenant_id)) -> list[IncidentRecord]:
	return await list_incidents_by_tenant(tenant_id)
