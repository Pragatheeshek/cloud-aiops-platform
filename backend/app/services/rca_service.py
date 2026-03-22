from typing import Any


def analyze_root_cause(metric_data: dict[str, Any]) -> str:
	cpu_usage = float(metric_data.get("cpu_usage", 0))
	memory_usage = float(metric_data.get("memory_usage", 0))
	network_traffic = float(metric_data.get("network_traffic", 0))
	error_rate = float(metric_data.get("error_rate", 0))

	if cpu_usage > 90 and network_traffic > 400:
		return "Traffic spike causing system overload"

	if error_rate > 10 and memory_usage > 90:
		return "Application crash due to memory overload"

	if cpu_usage > 90 and error_rate == 0:
		return "Scheduled background job"

	if network_traffic > 400 and error_rate > 5:
		return "High incoming requests causing API failures"

	return "Undetermined cause"
