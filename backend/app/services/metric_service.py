from datetime import datetime, timezone
from uuid import uuid4

from app.db.collections import get_incidents_collection, get_metrics_collection
from app.schemas.metric_schema import MetricIn, MetricRecord
from app.services.anomaly_service import analyze_metric
from app.services.auto_remediation_service import remediate_incident


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
		incident_doc = {
			"tenant_id": tenant_id,
			"metric_id": metric_doc["id"],
			"alerts": anomaly_result["alerts"],
			"severity": anomaly_result["severity"],
			"sla_risk_score": anomaly_result.get("sla_risk_score", 0),
			"ai_action": anomaly_result.get("ai_action", "scale_resources"),
			"status": "open",
			"created_at": datetime.now(timezone.utc),
			"resolved_at": None,
		}
		insert_result = await incidents_collection.insert_one(incident_doc)
		await remediate_incident(
			incident_id=str(insert_result.inserted_id),
			ai_action=incident_doc["ai_action"],
		)

	return MetricRecord(**metric_doc)
