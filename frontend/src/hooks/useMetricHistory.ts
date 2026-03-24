import { useEffect, useState } from "react";

import type { MetricPoint, MetricTrendPoint } from "../types";
import { formatTime } from "../utils/format";

const DEFAULT_HISTORY_SIZE = 20;
const DEFAULT_INTERVAL_MS = 3000;

function toBucketTimestamp(isoTimestamp: string, intervalMs: number): number {
	const raw = new Date(isoTimestamp).getTime();
	const resolved = Number.isFinite(raw) ? raw : Date.now();
	return Math.floor(resolved / intervalMs) * intervalMs;
}

export function useMetricHistory(
	metric: MetricPoint | null,
	size = DEFAULT_HISTORY_SIZE,
	intervalMs = DEFAULT_INTERVAL_MS,
) {
	const [history, setHistory] = useState<MetricTrendPoint[]>([]);

	useEffect(() => {
		if (!metric) return;

		setHistory((previous) => {
			const bucketTimestamp = toBucketTimestamp(metric.timestamp, intervalMs);
			const nextPoint: MetricTrendPoint = {
				timestamp: bucketTimestamp,
				time: formatTime(new Date(bucketTimestamp).toISOString()),
				cpu: metric.cpu_usage,
				memory: metric.memory_usage,
				network: metric.network_traffic,
				error: metric.error_rate,
			};

			const last = previous[previous.length - 1];
			const next =
				last && last.timestamp === nextPoint.timestamp
					? [...previous.slice(0, -1), nextPoint]
					: [...previous, nextPoint];

			if (next.length <= size) return next;
			return next.slice(next.length - size);
		});
	}, [intervalMs, metric, size]);

	return history;
}
