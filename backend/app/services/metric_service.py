from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.db.collections import get_incidents_collection, get_metrics_collection
from app.schemas.metric_schema import MetricIn, MetricRecord
from app.services.anomaly_service import analyze_metric
from app.services.auto_remediation_service import remediate_incident
from app.services.bootstrap_service import ensure_tenant_bootstrap_data
from app.services.decision_service import decide_action
from app.services.rca_service import analyze_root_cause
from app.services.sla_service import calculate_sla_risk


async def ingest_metric(tenant_id: str, payload: MetricIn) -> MetricRecord:
	metrics_collection = get_metrics_collection()
	incidents_collection = get_incidents_collection()

	metric_doc = {
		"id": str(uuid4()),
		"tenant_id": tenant_id,
		"cpu_usage": payload.cpu_usage,
		"memory_usage": payload.memory_usage,
		"network_traffic": payload.network_traffic,
		"error_rate": payload.error_rate,
		"timestamp": datetime.now(timezone.utc),
	}

	await metrics_collection.insert_one(metric_doc)

	anomaly_result = analyze_metric(metric_doc)
	if anomaly_result["is_anomaly"]:
		created_at = datetime.now(timezone.utc)
		root_cause = analyze_root_cause(metric_doc)
		decision_result = await decide_action(metric_doc, root_cause)
		sla_result = calculate_sla_risk(created_at)
		incident_doc = {
			"tenant_id": tenant_id,
			"metric_id": metric_doc["id"],
			"alerts": anomaly_result["alerts"],
			"severity": decision_result["severity"],
			"sla_risk_score": sla_result["sla_risk_score"],
			"risk_level": sla_result["risk_level"],
			"ai_action": decision_result["action"],
			"decision_description": decision_result["description"],
			"root_cause": root_cause,
			"status": "open",
			"created_at": created_at,
			"resolved_at": None,
		}
		insert_result = await incidents_collection.insert_one(incident_doc)
		await remediate_incident(
			incident_id=str(insert_result.inserted_id),
			ai_action=incident_doc["ai_action"],
		)

	return MetricRecord(**metric_doc)


async def get_latest_metric_by_tenant(tenant_id: str) -> MetricRecord:
	await ensure_tenant_bootstrap_data(tenant_id)

	metrics_collection = get_metrics_collection()
	metric_doc = await metrics_collection.find_one({"tenant_id": tenant_id}, sort=[("timestamp", -1)])

	if metric_doc is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="No metrics available for this tenant",
		)

	return MetricRecord(**metric_doc)


async def list_metrics_by_tenant(tenant_id: str, limit: int = 120) -> list[MetricRecord]:
	await ensure_tenant_bootstrap_data(tenant_id)

	metrics_collection = get_metrics_collection()
	metric_docs = await metrics_collection.find({"tenant_id": tenant_id}).sort("timestamp", -1).to_list(length=limit)

	return [MetricRecord(**doc) for doc in metric_docs]
