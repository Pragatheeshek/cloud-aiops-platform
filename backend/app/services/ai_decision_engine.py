from typing import Any


def process_incident(metric_data: dict[str, Any], alerts: list[str]) -> dict[str, Any]:
	cpu_usage = float(metric_data.get("cpu_usage", 0))
	error_rate = float(metric_data.get("error_rate", 0))
	network_traffic = float(metric_data.get("network_traffic", 0))
	memory_usage = float(metric_data.get("memory_usage", 0))

	severity = "warning"
	action = "scale_resources"

	if cpu_usage > 90 and error_rate > 10:
		severity = "critical"
		action = "restart_service"
	elif cpu_usage > 80:
		severity = "warning"
		action = "scale_resources"
	elif network_traffic > 400:
		severity = "warning"
		action = "throttle_traffic"

	if memory_usage > 95:
		severity = "critical"
		action = "restart_service"

	score = 10
	if severity == "critical":
		score += 45
	if "High Error Rate" in alerts:
		score += 20
	if "High CPU Usage" in alerts:
		score += 15
	if "High Memory Usage" in alerts:
		score += 10
	if "Network Traffic Spike" in alerts:
		score += 10

	sla_risk_score = min(100, score)

	return {
		"severity": severity,
		"sla_risk_score": sla_risk_score,
		"ai_action": action,
	}
