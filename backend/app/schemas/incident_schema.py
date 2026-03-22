from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class AnomalyResult(BaseModel):
	is_anomaly: bool
	severity: Literal["normal", "warning", "critical"]
	alerts: list[str]


class IncidentRecord(BaseModel):
	id: str
	tenant_id: str
	metric_id: str
	alerts: list[str]
	root_cause: str
	severity: Literal["warning", "critical"]
	sla_risk_score: int
	risk_level: Literal["LOW", "MEDIUM", "HIGH"]
	ai_action: Literal[
		"restart_service",
		"scale_resources",
		"throttle_traffic",
		"optimize_load",
		"monitor",
	]
	status: Literal["open", "resolved"]
	created_at: datetime
	resolved_at: datetime | None = None


class DashboardStats(BaseModel):
	total_incidents: int
	critical_incidents: int
	resolved_incidents: int
	average_resolution_time_seconds: float
