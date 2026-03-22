async def decide_action(metric_data: dict, root_cause: str) -> dict:
	cpu_usage = float(metric_data.get("cpu_usage", 0))
	error_rate = float(metric_data.get("error_rate", 0))

	severity = "warning"
	if cpu_usage > 90 or error_rate > 10:
		severity = "critical"
	elif cpu_usage > 80:
		severity = "warning"

	root_cause_text = root_cause.lower()
	action = "monitor"
	description = "Monitoring incident for stability"

	if "traffic spike" in root_cause_text:
		action = "scale_resources"
		description = "Scaling resources due to traffic spike"
	elif "memory overload" in root_cause_text:
		action = "restart_service"
		description = "Restarting service due to memory overload"
	elif "api failure" in root_cause_text:
		action = "restart_service"
		description = "Restarting service due to API failures"
	elif cpu_usage > 90 and error_rate == 0:
		action = "optimize_load"
		description = "Optimizing workload distribution for high CPU usage"

	return {
		"severity": severity,
		"action": action,
		"description": description,
	}
