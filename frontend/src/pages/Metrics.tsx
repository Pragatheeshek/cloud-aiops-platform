import { useEffect, useMemo, useState } from "react";

import MetricChart from "../components/MetricChart";
import { loadIncidents } from "../store/incidentStore";
import type { Incident } from "../types";

type MetricSnapshot = {
	cpu_usage: number;
	memory_usage: number;
	network_traffic: number;
	error_rate: number;
};

function buildMetricSnapshot(incident: Incident | null): MetricSnapshot {
	const baseline: MetricSnapshot = {
		cpu_usage: 42,
		memory_usage: 56,
		network_traffic: 220,
		error_rate: 2,
	};

	if (!incident) return baseline;

	const alerts = new Set(incident.alerts);

	return {
		cpu_usage: alerts.has("High CPU Usage") ? 94 : baseline.cpu_usage,
		memory_usage: alerts.has("High Memory Usage") ? 92 : baseline.memory_usage,
		network_traffic: alerts.has("Network Traffic Spike") ? 430 : baseline.network_traffic,
		error_rate: alerts.has("High Error Rate") ? 12 : baseline.error_rate,
	};
}

export default function Metrics() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const load = async () => {
			try {
				const data = await loadIncidents();
				if (mounted) setIncidents(data);
			} finally {
				if (mounted) setIsLoading(false);
			}
		};

		void load();
		const interval = setInterval(() => {
			void load();
		}, 5000);

		return () => {
			mounted = false;
			clearInterval(interval);
		};
	}, []);

	const snapshot = useMemo(() => buildMetricSnapshot(incidents[0] ?? null), [incidents]);

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-xl font-semibold">Live Metrics</h2>
				<p className="text-sm text-slate-400">Updated every 5 seconds from latest platform events.</p>
			</div>

			{isLoading ? (
				<p className="text-sm text-slate-400">Loading metric stream...</p>
			) : (
				<MetricChart metrics={snapshot} />
			)}
		</div>
	);
}
