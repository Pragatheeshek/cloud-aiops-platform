import { useCallback, useMemo } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";

import LoadingSkeleton from "../components/LoadingSkeleton";
import { useMetricHistory } from "../hooks/useMetricHistory";
import { usePolling } from "../hooks/usePolling";
import { fetchLatestMetric } from "../services/api";
import { formatNumber } from "../utils/format";

const POLLING_MS = 3000;
const NO_METRICS_MESSAGE = "No metrics available for this tenant";

type DialMetric = {
	label: string;
	value: number;
	max: number;
	unit: string;
	tone: "cpu" | "memory" | "network" | "error";
	goodThreshold: number;
	warnThreshold: number;
};

function toneStyle(tone: DialMetric["tone"]): { ring: string; glow: string; chip: string } {
	if (tone === "cpu") {
		return {
			ring: "#10B981",
			glow: "linear-gradient(155deg, rgba(6, 95, 70, 0.35), rgba(15, 23, 42, 0.95))",
			chip: "border-success/40 bg-success/12 text-success",
		};
	}
	if (tone === "memory") {
		return {
			ring: "#22D3EE",
			glow: "linear-gradient(155deg, rgba(8, 145, 178, 0.35), rgba(15, 23, 42, 0.95))",
			chip: "border-accent/40 bg-accent/12 text-accent",
		};
	}
	if (tone === "network") {
		return {
			ring: "#3B82F6",
			glow: "linear-gradient(155deg, rgba(30, 64, 175, 0.34), rgba(15, 23, 42, 0.95))",
			chip: "border-primary/40 bg-primary/12 text-primary",
		};
	}
	return {
		ring: "#EF4444",
		glow: "linear-gradient(155deg, rgba(153, 27, 27, 0.34), rgba(15, 23, 42, 0.95))",
		chip: "border-danger/40 bg-danger/12 text-danger",
	};
}

function metricState(value: number, goodThreshold: number, warnThreshold: number): "good" | "watch" | "critical" {
	if (value >= warnThreshold) return "critical";
	if (value >= goodThreshold) return "watch";
	return "good";
}

function stateBadge(state: "good" | "watch" | "critical"): string {
	if (state === "good") return "border-success/35 bg-success/12 text-success";
	if (state === "watch") return "border-warning/35 bg-warning/12 text-warning";
	return "border-danger/35 bg-danger/12 text-danger";
}

function formatTick(value: number): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
}

export default function Metrics() {
	const navigate = useNavigate();
	const loadMetric = useCallback(() => fetchLatestMetric(), []);
	const { data, isLoading, error, lastUpdated } = usePolling(loadMetric, POLLING_MS);
	const history = useMetricHistory(data, 24);

	const dialMetrics = useMemo<DialMetric[]>(
		() => [
			{
				label: "CPU Load",
				value: data?.cpu_usage ?? 0,
				max: 100,
				unit: "%",
				tone: "cpu",
				goodThreshold: 60,
				warnThreshold: 85,
			},
			{
				label: "Memory Pressure",
				value: data?.memory_usage ?? 0,
				max: 100,
				unit: "%",
				tone: "memory",
				goodThreshold: 65,
				warnThreshold: 85,
			},
			{
				label: "Network Throughput",
				value: data?.network_traffic ?? 0,
				max: 500,
				unit: " Mbps",
				tone: "network",
				goodThreshold: 250,
				warnThreshold: 400,
			},
			{
				label: "Error Intensity",
				value: data?.error_rate ?? 0,
				max: 15,
				unit: "",
				tone: "error",
				goodThreshold: 3,
				warnThreshold: 5,
			},
		],
		[data],
	);

	const hasHiddenNoMetricsError = Boolean(
		error && error.toLowerCase().includes(NO_METRICS_MESSAGE.toLowerCase()),
	);

	const metricRouteByTone: Record<DialMetric["tone"], string> = {
		cpu: "/metrics/cpu",
		memory: "/metrics/memory",
		network: "/metrics/network",
		error: "/metrics/error",
	};

	return (
		<div className="space-y-6">
			<section className="rounded-3xl border border-primary/30 bg-[linear-gradient(145deg,rgba(30,58,138,0.28),rgba(15,23,42,0.95))] px-6 py-5 shadow-panel">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h3 className="text-2xl font-bold text-text">Telemetry Studio</h3>
						<p className="mt-1 text-sm text-slate-300">Unique metrics format refreshed every 3 seconds.</p>
					</div>
					<div className="rounded-full border border-primary/35 bg-primary/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Waiting for stream"}
					</div>
				</div>
			</section>

			{error && !hasHiddenNoMetricsError ? (
				<p className="rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
			) : null}

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<LoadingSkeleton className="h-44" />
					<LoadingSkeleton className="h-44" />
					<LoadingSkeleton className="h-44" />
					<LoadingSkeleton className="h-44" />
				</div>
			) : (
				<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{dialMetrics.map((metric) => {
						const ratio = Math.max(0, Math.min(1, metric.value / metric.max));
						const percent = Math.round(ratio * 100);
						const state = metricState(metric.value, metric.goodThreshold, metric.warnThreshold);
						const tone = toneStyle(metric.tone);

						return (
							<button
								key={metric.label}
								type="button"
								onClick={() => navigate(metricRouteByTone[metric.tone])}
								className="rounded-3xl border border-slate-700/70 p-5 text-left shadow-panel transition active:scale-[0.98]"
								style={{ background: tone.glow }}
							>
								<div className="mb-4 flex items-center justify-between">
									<p className="text-sm font-semibold text-slate-200">{metric.label}</p>
									<span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${stateBadge(state)}`}>
										{state}
									</span>
								</div>
								<div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-slate-700/80 bg-slate-950/50"
									style={{
										backgroundImage: `conic-gradient(${tone.ring} ${percent * 3.6}deg, rgba(15,23,42,0.9) ${percent * 3.6}deg)`,
									}}
								>
									<div className="grid h-20 w-20 place-items-center rounded-full bg-slate-950/95 text-center">
										<p className="text-xs text-slate-400">Load</p>
										<p className="text-sm font-bold text-text">{percent}%</p>
									</div>
								</div>
								<p className="mt-4 text-3xl font-bold text-text">
									{formatNumber(metric.value)}
									{metric.unit}
								</p>
								<p className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone.chip}`}>
									Threshold {metric.goodThreshold}/{metric.warnThreshold}
								</p>
							</button>
						);
					})}
				</section>
			)}

			<section className="grid gap-4 xl:grid-cols-5">
				<div className="rounded-3xl border border-accent/30 bg-[linear-gradient(155deg,rgba(6,78,59,0.2),rgba(15,23,42,0.95))] p-5 xl:col-span-2">
					<h4 className="text-lg font-bold text-text">Signal Matrix</h4>
					<p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">Current level against guardrails</p>
					<div className="mt-4 space-y-3">
						{dialMetrics.map((metric) => {
							const ratio = Math.max(0, Math.min(1, metric.value / metric.max));
							const state = metricState(metric.value, metric.goodThreshold, metric.warnThreshold);
							const tone = toneStyle(metric.tone);
							return (
								<button
									key={`${metric.label}-matrix`}
									type="button"
									onClick={() => navigate(metricRouteByTone[metric.tone])}
									className="block w-full text-left transition active:scale-[0.99]"
								>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span className="text-slate-300">{metric.label}</span>
										<span className={`rounded-full border px-2 py-0.5 font-semibold uppercase ${stateBadge(state)}`}>{state}</span>
									</div>
									<div className="h-2.5 rounded-full bg-slate-800/85">
										<div
											className="h-2.5 rounded-full transition-all duration-500"
											style={{ width: `${Math.round(ratio * 100)}%`, backgroundColor: tone.ring }}
										/>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				<div className="rounded-3xl border border-primary/30 bg-[linear-gradient(155deg,rgba(30,58,138,0.22),rgba(15,23,42,0.95))] p-5 xl:col-span-3">
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h4 className="text-lg font-bold text-text">Unified Timeline</h4>
							<p className="text-xs uppercase tracking-[0.14em] text-slate-400">CPU, memory, network, error</p>
						</div>
						<span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
							{history.length} samples
						</span>
					</div>
					<div className="h-80 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-3">
						{history.length === 0 ? (
							<div className="grid h-full place-items-center text-center">
								<div>
									<p className="text-lg font-semibold text-slate-200">Awaiting telemetry samples</p>
									<p className="mt-1 text-sm text-slate-400">Timeline will render once backend metrics are available.</p>
								</div>
							</div>
						) : (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={history}>
									<CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.16)" />
									<XAxis
										type="number"
										dataKey="timestamp"
										domain={["dataMin", "dataMax"]}
										tickFormatter={formatTick}
										stroke="#94A3B8"
										fontSize={12}
										minTickGap={28}
									/>
									<YAxis stroke="#94A3B8" fontSize={12} />
									<Tooltip
										labelFormatter={(label) => formatTick(Number(label))}
										contentStyle={{
											backgroundColor: "#020617",
											border: "1px solid rgba(71, 85, 105, 0.9)",
											borderRadius: "12px",
											color: "#E5E7EB",
										}}
									/>
									<Legend />
									<Line type="monotone" dataKey="cpu" name="CPU" stroke="#10B981" strokeWidth={2.5} dot={false} />
									<Line type="monotone" dataKey="memory" name="Memory" stroke="#22D3EE" strokeWidth={2.5} dot={false} />
									<Line type="monotone" dataKey="network" name="Network" stroke="#3B82F6" strokeWidth={2} dot={false} />
									<Line type="monotone" dataKey="error" name="Error" stroke="#EF4444" strokeWidth={2} dot={false} />
								</LineChart>
							</ResponsiveContainer>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
