import {
	Area,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { MetricTrendPoint } from "../types";

type TrendChartProps = {
	data: MetricTrendPoint[];
	title: string;
	showNetworkAndError?: boolean;
};

function formatTimeTick(value: number): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
}

export default function TrendChart({ data, title, showNetworkAndError = false }: TrendChartProps) {
	const samplingLabel = (() => {
		if (data.length < 2) return "Sampling warm-up";
		const first = data[0].timestamp;
		const last = data[data.length - 1].timestamp;
		const durationSeconds = Math.max((last - first) / 1000, 1);
		const hertz = (data.length - 1) / durationSeconds;
		const periodSeconds = 1 / Math.max(hertz, 0.001);
		return `${hertz.toFixed(2)} Hz • ${periodSeconds.toFixed(1)}s period`;
	})();

	if (data.length === 0) {
		return (
			<section className="panel-soft rounded-3xl p-6">
				<div className="mb-5 flex items-center justify-between gap-4">
					<h3 className="text-xl font-bold text-text">{title}</h3>
					<span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
						Live Stream
					</span>
				</div>
				<div className="flex h-72 items-center justify-center rounded-3xl border border-slate-700/70 bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.14),transparent_45%),linear-gradient(150deg,rgba(15,23,42,0.95),rgba(2,6,23,0.85))] p-6 text-center">
					<div>
						<p className="text-lg font-semibold text-slate-200">Awaiting telemetry samples</p>
						<p className="mt-2 text-sm text-slate-400">CPU and memory streams will appear here automatically.</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="panel-soft rounded-3xl p-6">
			<div className="mb-5 flex items-center justify-between gap-4">
				<div>
					<h3 className="text-xl font-bold text-text">{title}</h3>
					<p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{samplingLabel}</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
						CPU
					</span>
					<span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
						Memory
					</span>
					<span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
						Live
					</span>
				</div>
			</div>
			<div className="h-72 w-full rounded-3xl border border-slate-700/70 bg-[radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.16),transparent_42%),linear-gradient(150deg,rgba(15,23,42,0.95),rgba(2,6,23,0.9))] p-3">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<defs>
							<linearGradient id="cpuStroke" x1="0" y1="0" x2="1" y2="0">
								<stop offset="0%" stopColor="#3B82F6" />
								<stop offset="100%" stopColor="#60A5FA" />
							</linearGradient>
							<linearGradient id="memoryStroke" x1="0" y1="0" x2="1" y2="0">
								<stop offset="0%" stopColor="#22D3EE" />
								<stop offset="100%" stopColor="#67E8F9" />
							</linearGradient>
							<linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
								<stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="memoryFill" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#22D3EE" stopOpacity={0.2} />
								<stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.16)" />
						<XAxis
							type="number"
							dataKey="timestamp"
							domain={["dataMin", "dataMax"]}
							tickFormatter={formatTimeTick}
							stroke="#94A3B8"
							fontSize={12}
							minTickGap={28}
						/>
						<YAxis stroke="#94A3B8" fontSize={12} />
						<Tooltip
							labelFormatter={(label) => formatTimeTick(Number(label))}
							contentStyle={{
								backgroundColor: "#020617",
								border: "1px solid rgba(71, 85, 105, 0.9)",
								borderRadius: "12px",
								color: "#E5E7EB",
							}}
						/>
						<Legend />
						<Area type="monotone" dataKey="cpu" stroke="none" fill="url(#cpuFill)" isAnimationActive animationDuration={450} />
						<Area
							type="monotone"
							dataKey="memory"
							stroke="none"
							fill="url(#memoryFill)"
							isAnimationActive
							animationDuration={450}
						/>
						<Line
							type="monotone"
							dataKey="cpu"
							name="CPU"
							stroke="url(#cpuStroke)"
							strokeWidth={3}
							dot={{ r: 0 }}
							activeDot={{ r: 4, strokeWidth: 0, fill: "#60A5FA" }}
							isAnimationActive
							animationDuration={450}
						/>
						<Line
							type="monotone"
							dataKey="memory"
							name="Memory"
							stroke="url(#memoryStroke)"
							strokeWidth={3}
							dot={{ r: 0 }}
							activeDot={{ r: 4, strokeWidth: 0, fill: "#67E8F9" }}
							isAnimationActive
							animationDuration={450}
						/>
						{showNetworkAndError ? (
							<>
								<Line
									type="monotone"
									dataKey="network"
									name="Network"
									stroke="#10B981"
									strokeWidth={2}
									dot={false}
									isAnimationActive
									animationDuration={450}
								/>
								<Line
									type="monotone"
									dataKey="error"
									name="Error"
									stroke="#EF4444"
									strokeWidth={2}
									dot={false}
									isAnimationActive
									animationDuration={450}
								/>
							</>
						) : null}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
}
