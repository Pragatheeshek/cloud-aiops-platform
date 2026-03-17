import os
import random
import time
from datetime import datetime

import requests

API_URL = os.getenv("METRICS_API_URL", "http://127.0.0.1:8000/metrics")
JWT_TOKEN = os.getenv("JWT_TOKEN", "REPLACE_WITH_VALID_TOKEN")
REQUEST_TIMEOUT_SECONDS = 10
SEND_INTERVAL_SECONDS = 3


def generate_metrics(iteration: int) -> dict[str, float]:
	is_failure_iteration = iteration % 5 == 0

	if is_failure_iteration:
		return {
			"cpu_usage": round(random.uniform(90, 100), 2),
			"memory_usage": round(random.uniform(85, 100), 2),
			"network_traffic": round(random.uniform(250, 500), 2),
			"error_rate": round(random.uniform(10, 20), 2),
		}

	return {
		"cpu_usage": round(random.uniform(40, 60), 2),
		"memory_usage": round(random.uniform(50, 70), 2),
		"network_traffic": round(random.uniform(100, 300), 2),
		"error_rate": round(random.uniform(0, 2), 2),
	}


def send_metrics(metrics: dict[str, float]) -> None:
	headers = {
		"Authorization": f"Bearer {JWT_TOKEN}",
		"Content-Type": "application/json",
	}

	try:
		response = requests.post(
			API_URL,
			json=metrics,
			headers=headers,
			timeout=REQUEST_TIMEOUT_SECONDS,
		)
		print(
			f"[{datetime.now().isoformat()}] Sent: {metrics} | "
			f"Status: {response.status_code} | Response: {response.text}"
		)
	except requests.RequestException as exc:
		print(f"[{datetime.now().isoformat()}] Request failed: {exc}")


def main_loop() -> None:
	iteration = 1
	while True:
		metrics = generate_metrics(iteration)
		send_metrics(metrics)
		iteration += 1
		time.sleep(SEND_INTERVAL_SECONDS)


if __name__ == "__main__":
	main_loop()
