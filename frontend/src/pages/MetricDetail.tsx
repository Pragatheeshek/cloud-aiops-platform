import { useCallback } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import LoadingSkeleton from "../components/LoadingSkeleton";
import MetricCard from "../components/MetricCard";
import TrendChart from "../components/TrendChart";
import { useMetricHistory } from "../hooks/useMetricHistory";
import { usePolling } from "../hooks/usePolling";
import { fetchLatestMetric } from "../services/api";
import type { MetricPoint } from "../types";

const POLLING_MS = 3000;

type MetricType = "cpu" | "memory" | "network" | "error";

type MetricMeta = {
	title: string;
	label: string;
	unit?: string;
	dangerThreshold?: number;
	accent: "primary" | "accent" | "warning" | "danger" | "success";
	value: (metric: MetricPoint) => number;
};

const METRIC_META: Record<MetricType, MetricMeta> = {
	cpu: {
		title: "CPU Usage",
		label: "CPU Usage",
		unit: "%",
		dangerThreshold: 85,
		accent: "success",
		value: (metric) => metric.cpu_usage,
	},
	memory: {
		title: "Memory Usage",
		label: "Memory Usage",
		unit: "%",
		dangerThreshold: 85,
		accent: "accent",
		value: (metric) => metric.memory_usage,
	},
	network: {
		title: "Network Traffic",
		label: "Network Traffic",
		accent: "primary",
		value: (metric) => metric.network_traffic,
	},
	error: {
		title: "Error Rate",
		label: "Error Rate",
		dangerThreshold: 5,
		accent: "danger",
		value: (metric) => metric.error_rate,
	},
};

function isMetricType(value: string | undefined): value is MetricType {
	return value === "cpu" || value === "memory" || value === "network" || value === "error";
}

export default function MetricDetail() {
	const { metricType } = useParams<{ metricType: string }>();

	if (!isMetricType(metricType)) {
		return <Navigate to="/metrics" replace />;
	}

	const meta = METRIC_META[metricType];
	const loadMetric = useCallback(() => fetchLatestMetric(), []);
	const { data, isLoading, error, lastUpdated } = usePolling(loadMetric, POLLING_MS);
	const history = useMetricHistory(data, 30);

	const currentValue = data ? meta.value(data) : 0;
	const isDanger = meta.dangerThreshold ? currentValue > meta.dangerThreshold : false;

	return (
		<div className="space-y-5">
			<section className="panel-soft rounded-2xl p-5">
				<div className="flex items-center justify-between gap-3">
					<div>
						<h3 className="text-2xl font-bold text-text">{meta.title} Details</h3>
						<p className="mt-1 text-sm text-slate-400">
							Live data every 3 seconds
							{lastUpdated ? ` • ${lastUpdated.toLocaleTimeString()}` : ""}
						</p>
					</div>
					<Link
						to="/dashboard"
						className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-primary/55 hover:text-primary"
					>
						Back to Dashboard
					</Link>
				</div>
			</section>

			{error ? (
				<p className="rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
			) : null}

			{isLoading ? (
				<LoadingSkeleton className="h-36" />
			) : (
				<MetricCard
					label={meta.label}
					value={currentValue}
					unit={meta.unit}
					isDanger={isDanger}
					accent={isDanger ? "danger" : meta.accent}
				/>
			)}

			<TrendChart data={history} title={`${meta.title} Trend`} showNetworkAndError />
		</div>
	);
}
