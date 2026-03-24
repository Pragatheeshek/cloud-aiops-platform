import { useCallback } from "react";

import IncidentList from "../components/IncidentList";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MetricCard from "../components/MetricCard";
import TrendChart from "../components/TrendChart";
import { useMetricHistory } from "../hooks/useMetricHistory";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents, fetchLatestMetric } from "../services/api";

const POLLING_MS = 3000;
const NO_METRICS_MESSAGE = "No metrics available for this tenant";

export default function Dashboard() {
	const loadMetric = useCallback(() => fetchLatestMetric(), []);
	const loadIncidents = useCallback(() => fetchIncidents(), []);

	const metricState = usePolling(loadMetric, POLLING_MS);
	const incidentsState = usePolling(loadIncidents, POLLING_MS);
	const history = useMetricHistory(metricState.data);

	const metric = metricState.data;

	return (
		<div className="space-y-6">
			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{metricState.isLoading ? (
					<>
						<LoadingSkeleton className="h-36" />
						<LoadingSkeleton className="h-36" />
						<LoadingSkeleton className="h-36" />
						<LoadingSkeleton className="h-36" />
					</>
				) : (
					<>
						<MetricCard
							label="CPU Usage"
							value={metric?.cpu_usage ?? 0}
							unit="%"
							isDanger={(metric?.cpu_usage ?? 0) > 85}
							accent={(metric?.cpu_usage ?? 0) > 85 ? "danger" : "success"}
							to="/metrics/cpu"
						/>
						<MetricCard
							label="Memory Usage"
							value={metric?.memory_usage ?? 0}
							unit="%"
							isDanger={(metric?.memory_usage ?? 0) > 85}
							accent={(metric?.memory_usage ?? 0) > 85 ? "warning" : "accent"}
							to="/metrics/memory"
						/>
						<MetricCard
							label="Network Traffic"
							value={metric?.network_traffic ?? 0}
							accent="primary"
							to="/metrics/network"
						/>
						<MetricCard
							label="Error Rate"
							value={metric?.error_rate ?? 0}
							isDanger={(metric?.error_rate ?? 0) > 5}
							accent={(metric?.error_rate ?? 0) > 5 ? "danger" : "success"}
							to="/metrics/error"
						/>
					</>
				)}
			</section>

			{metricState.error && !metricState.error.toLowerCase().includes(NO_METRICS_MESSAGE.toLowerCase()) ? (
				<p className="rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm font-semibold text-danger">
					{metricState.error}
				</p>
			) : null}

			<section className="grid gap-4 xl:grid-cols-3">
				<div className="xl:col-span-2">
					<TrendChart data={history} title="CPU and Memory Trend" />
				</div>
				<div className="rounded-3xl border border-warning/30 bg-[linear-gradient(145deg,rgba(120,53,15,0.2),rgba(15,23,42,0.94))] p-5 shadow-panel">
					<div className="mb-3 flex items-center justify-between">
						<h3 className="text-lg font-bold text-text">Incident Feed</h3>
						<span className="rounded-full border border-warning/35 bg-warning/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-warning">
							Ops Channel
						</span>
					</div>
					<div className="max-h-[32rem] space-y-3 overflow-auto pr-1 scrollbar-thin">
						{incidentsState.isLoading ? (
							<>
								<LoadingSkeleton className="h-28" />
								<LoadingSkeleton className="h-28" />
							</>
						) : (
							<IncidentList incidents={(incidentsState.data ?? []).slice(0, 6)} />
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
