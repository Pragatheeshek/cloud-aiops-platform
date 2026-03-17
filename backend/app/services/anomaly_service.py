from typing import Any

from app.services.ai_decision_engine import process_incident


def detect_anomaly(metric_data: dict[str, Any]) -> dict[str, Any]:
	alerts: list[str] = []
	severity = "normal"

	cpu_usage = float(metric_data.get("cpu_usage", 0))
	memory_usage = float(metric_data.get("memory_usage", 0))
	error_rate = float(metric_data.get("error_rate", 0))
	network_traffic = float(metric_data.get("network_traffic", 0))

	if cpu_usage > 90:
		alerts.append("High CPU Usage")
		severity = "critical"
	elif cpu_usage > 80:
		alerts.append("High CPU Usage")
		if severity != "critical":
			severity = "warning"

	if memory_usage > 95:
		alerts.append("High Memory Usage")
		severity = "critical"
	elif memory_usage > 85:
		alerts.append("High Memory Usage")
		if severity != "critical":
			severity = "warning"

	if error_rate > 10:
		alerts.append("High Error Rate")
		severity = "critical"
	elif error_rate > 5:
		alerts.append("High Error Rate")
		if severity != "critical":
			severity = "warning"

	if network_traffic > 400:
		alerts.append("Network Traffic Spike")
		if severity == "normal":
			severity = "warning"

	return {
		"is_anomaly": len(alerts) > 0,
		"severity": severity,
		"alerts": alerts,
	}


def analyze_metric(metric_data: dict[str, Any]) -> dict[str, Any]:
	anomaly_result = detect_anomaly(metric_data)
	if not anomaly_result["is_anomaly"]:
		return anomaly_result

	ai_result = process_incident(metric_data, anomaly_result["alerts"])
	return {
		**anomaly_result,
		"severity": ai_result["severity"],
		"sla_risk_score": ai_result["sla_risk_score"],
		"ai_action": ai_result["ai_action"],
	}
