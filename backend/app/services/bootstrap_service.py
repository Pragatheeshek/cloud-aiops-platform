from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.db.collections import get_incidents_collection, get_metrics_collection


async def ensure_tenant_bootstrap_data(tenant_id: str) -> None:
	metrics_collection = get_metrics_collection()
	incidents_collection = get_incidents_collection()

	has_metrics = await metrics_collection.count_documents({"tenant_id": tenant_id}, limit=1)
	has_incidents = await incidents_collection.count_documents({"tenant_id": tenant_id}, limit=1)

	if has_metrics and has_incidents:
		return

	now = datetime.now(timezone.utc)

	if not has_metrics:
		metric_docs = []
		for index in range(24):
			timestamp = now - timedelta(seconds=(24 - index) * 3)
			metric_docs.append(
				{
					"id": str(uuid4()),
					"tenant_id": tenant_id,
					"cpu_usage": round(42 + (index % 6) * 3.2, 2),
					"memory_usage": round(51 + (index % 5) * 2.8, 2),
					"network_traffic": round(160 + (index % 7) * 19, 2),
					"error_rate": round(0.6 + (index % 4) * 0.35, 2),
					"timestamp": timestamp,
				}
			)

		await metrics_collection.insert_many(metric_docs)

	if not has_incidents:
		incident_created_at = now - timedelta(minutes=18)
		resolved_created_at = now - timedelta(hours=1, minutes=20)

		incident_docs = [
			{
				"tenant_id": tenant_id,
				"metric_id": str(uuid4()),
				"alerts": ["High CPU Usage", "High Memory Usage"],
				"severity": "critical",
				"sla_risk_score": 82,
				"risk_level": "HIGH",
				"ai_action": "scale_resources",
				"decision_description": "Scaled compute resources due to sustained load",
				"root_cause": "Traffic spike across cloud nodes",
				"status": "open",
				"created_at": incident_created_at,
				"resolved_at": None,
			},
			{
				"tenant_id": tenant_id,
				"metric_id": str(uuid4()),
				"alerts": ["High Error Rate"],
				"severity": "warning",
				"sla_risk_score": 46,
				"risk_level": "MEDIUM",
				"ai_action": "restart_service",
				"decision_description": "Restarted affected API service",
				"root_cause": "Transient API failure detected",
				"status": "resolved",
				"created_at": resolved_created_at,
				"resolved_at": resolved_created_at + timedelta(minutes=9),
			},
		]

		await incidents_collection.insert_many(incident_docs)