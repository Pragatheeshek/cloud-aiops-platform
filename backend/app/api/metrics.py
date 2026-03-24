from fastapi import APIRouter, Depends, status

from app.core.tenant import get_current_tenant_id
from app.schemas.metric_schema import MetricIn, MetricRecord
from app.services.metric_service import get_latest_metric_by_tenant, ingest_metric, list_metrics_by_tenant

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.post("", response_model=MetricRecord, status_code=status.HTTP_201_CREATED)
async def create_metric(
	payload: MetricIn,
	tenant_id: str = Depends(get_current_tenant_id),
) -> MetricRecord:
	return await ingest_metric(tenant_id=tenant_id, payload=payload)


@router.get("/latest", response_model=MetricRecord)
async def get_latest_metric(tenant_id: str = Depends(get_current_tenant_id)) -> MetricRecord:
	return await get_latest_metric_by_tenant(tenant_id)


@router.get("", response_model=list[MetricRecord])
async def get_metrics(tenant_id: str = Depends(get_current_tenant_id)) -> list[MetricRecord]:
	return await list_metrics_by_tenant(tenant_id)
