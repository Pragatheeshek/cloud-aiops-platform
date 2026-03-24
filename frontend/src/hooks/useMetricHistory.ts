import { useEffect, useState } from "react";

import type { MetricPoint, MetricTrendPoint } from "../types";
import { formatTime } from "../utils/format";

const DEFAULT_HISTORY_SIZE = 20;

export function useMetricHistory(metric: MetricPoint | null, size = DEFAULT_HISTORY_SIZE) {
	const [history, setHistory] = useState<MetricTrendPoint[]>([]);

	useEffect(() => {
		if (!metric) return;

		setHistory((previous) => {
			const nextPoint: MetricTrendPoint = {
				time: formatTime(metric.timestamp),
				cpu: metric.cpu_usage,
				memory: metric.memory_usage,
				network: metric.network_traffic,
				error: metric.error_rate,
			};

			const next = [...previous, nextPoint];
			if (next.length <= size) return next;
			return next.slice(next.length - size);
		});
	}, [metric, size]);

	return history;
}
