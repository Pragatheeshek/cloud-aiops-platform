from app.db.collections import get_incidents_collection
from app.schemas.incident_schema import DashboardStats, IncidentRecord


async def list_incidents_by_tenant(tenant_id: str) -> list[IncidentRecord]:
	incidents_collection = get_incidents_collection()
	incident_docs = (
		await incidents_collection.find({"tenant_id": tenant_id}).sort("created_at", -1).to_list(length=500)
	)

	return [
		IncidentRecord(
			id=str(doc["_id"]),
			tenant_id=doc["tenant_id"],
			metric_id=doc.get("metric_id", ""),
			alerts=doc["alerts"],
			severity=doc["severity"],
			sla_risk_score=doc.get("sla_risk_score", 0),
			ai_action=doc.get("ai_action", "scale_resources"),
			status=doc["status"],
			created_at=doc["created_at"],
			resolved_at=doc.get("resolved_at"),
		)
		for doc in incident_docs
	]


async def get_dashboard_stats(tenant_id: str) -> DashboardStats:
	incidents_collection = get_incidents_collection()
	incident_docs = await incidents_collection.find({"tenant_id": tenant_id}).to_list(length=2000)

	total_incidents = len(incident_docs)
	critical_incidents = sum(1 for doc in incident_docs if doc.get("severity") == "critical")
	resolved_incidents = sum(1 for doc in incident_docs if doc.get("status") == "resolved")

	resolution_times = []
	for doc in incident_docs:
		created_at = doc.get("created_at")
		resolved_at = doc.get("resolved_at")
		if created_at and resolved_at:
			resolution_times.append((resolved_at - created_at).total_seconds())

	average_resolution_time_seconds = (
		round(sum(resolution_times) / len(resolution_times), 2) if resolution_times else 0.0
	)

	return DashboardStats(
		total_incidents=total_incidents,
		critical_incidents=critical_incidents,
		resolved_incidents=resolved_incidents,
		average_resolution_time_seconds=average_resolution_time_seconds,
	)
