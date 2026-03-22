import os
import random
import time

import requests

API_URL = "http://127.0.0.1:8000/metrics"
SLEEP_SECONDS = 5
JWT_TOKEN = os.getenv("JWT_TOKEN", "")


def generate_metrics() -> tuple[dict[str, float], bool]:
    # Every few iterations, force anomaly-friendly values.
    is_anomaly = random.randint(1, 5) == 5

    if is_anomaly:
        metrics = {
            "cpu_usage": round(random.uniform(91, 100), 2),
            "memory_usage": round(random.uniform(70, 100), 2),
            "network_traffic": round(random.uniform(300, 500), 2),
            "error_rate": round(random.uniform(11, 15), 2),
        }
    else:
        metrics = {
            "cpu_usage": round(random.uniform(20, 100), 2),
            "memory_usage": round(random.uniform(30, 100), 2),
            "network_traffic": round(random.uniform(100, 500), 2),
            "error_rate": round(random.uniform(0, 15), 2),
        }

    return metrics, is_anomaly


def send_metrics(metrics: dict[str, float]) -> None:
    headers = {"Content-Type": "application/json"}
    if JWT_TOKEN:
        headers["Authorization"] = f"Bearer {JWT_TOKEN}"

    try:
        response = requests.post(API_URL, json=metrics, headers=headers, timeout=10)
        if 200 <= response.status_code < 300:
            print("Metrics sent")
        else:
            print(f"Failed to send metric: {response.status_code} {response.text}")
    except requests.RequestException as exc:
        print(f"Request error: {exc}")


def main() -> None:
    print("Cloud metric simulator started")
    if not JWT_TOKEN:
        print("Warning: JWT_TOKEN is not set. /metrics may return 401 Unauthorized.")

    while True:
        metric_data, is_anomaly = generate_metrics()
        if is_anomaly:
            print("Anomaly triggered")

        send_metrics(metric_data)
        time.sleep(SLEEP_SECONDS)


if __name__ == "__main__":
    main()
