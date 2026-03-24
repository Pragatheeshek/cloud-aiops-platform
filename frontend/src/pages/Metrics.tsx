import { useCallback } from "react";

import LoadingSkeleton from "../components/LoadingSkeleton";
import MetricCard from "../components/MetricCard";
import TrendChart from "../components/TrendChart";
import { useMetricHistory } from "../hooks/useMetricHistory";
import { usePolling } from "../hooks/usePolling";
import { fetchLatestMetric } from "../services/api";

const POLLING_MS = 3000;

export default function Metrics() {
	const loadMetric = useCallback(() => fetchLatestMetric(), []);
	const { data, isLoading, error, lastUpdated } = usePolling(loadMetric, POLLING_MS);
	const history = useMetricHistory(data, 18);

	return (
		<div className="space-y-5">
			<section className="panel-soft rounded-2xl p-5">
				<h3 className="text-2xl font-bold text-text">Live Metrics</h3>
				<p className="mt-1 text-sm text-slate-400">
					Streaming snapshot every 3 seconds
					{lastUpdated ? ` • ${lastUpdated.toLocaleTimeString()}` : ""}
				</p>
			</section>

			{error ? (
				<p className="rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
			) : null}

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<LoadingSkeleton className="h-36" />
					<LoadingSkeleton className="h-36" />
					<LoadingSkeleton className="h-36" />
					<LoadingSkeleton className="h-36" />
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<MetricCard
						label="CPU Usage"
						value={data?.cpu_usage ?? 0}
						unit="%"
						accent={(data?.cpu_usage ?? 0) > 85 ? "danger" : "success"}
						isDanger={(data?.cpu_usage ?? 0) > 85}
					/>
					<MetricCard
						label="Memory Usage"
						value={data?.memory_usage ?? 0}
						unit="%"
						accent={(data?.memory_usage ?? 0) > 85 ? "warning" : "accent"}
						isDanger={(data?.memory_usage ?? 0) > 85}
					/>
					<MetricCard label="Network Traffic" value={data?.network_traffic ?? 0} accent="primary" />
					<MetricCard
						label="Error Rate"
						value={data?.error_rate ?? 0}
						accent={(data?.error_rate ?? 0) > 5 ? "danger" : "success"}
						isDanger={(data?.error_rate ?? 0) > 5}
					/>
				</div>
			)}

			<div className="grid gap-4 xl:grid-cols-2">
				<TrendChart data={history} title="CPU + Memory Mini Trend" />
				<TrendChart data={history} title="Full Metric Trend" showNetworkAndError />
			</div>
		</div>
	);
}
