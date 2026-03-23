type MetricSnapshot = {
	cpu_usage: number;
	memory_usage: number;
	network_traffic: number;
	error_rate: number;
};

const barConfig = [
	{ key: "cpu_usage", label: "CPU Usage", max: 100, color: "bg-cyan-500" },
	{ key: "memory_usage", label: "Memory Usage", max: 100, color: "bg-indigo-500" },
	{ key: "network_traffic", label: "Network Traffic", max: 500, color: "bg-emerald-500" },
	{ key: "error_rate", label: "Error Rate", max: 15, color: "bg-rose-500" },
] as const;

export default function MetricChart({ metrics }: { metrics: MetricSnapshot }) {
	return (
		<section className="grid gap-4 md:grid-cols-2">
			{barConfig.map(({ key, label, max, color }) => {
				const value = metrics[key];
				const ratio = Math.min(100, Math.round((value / max) * 100));

				return (
					<article key={key} className="rounded-2xl border border-slate-700 bg-card/90 p-5 shadow-panel">
						<div className="mb-2 flex items-center justify-between">
							<p className="text-sm text-slate-300">{label}</p>
							<p className="text-lg font-semibold text-slate-100">{value}</p>
						</div>
						<div className="h-2 rounded-full bg-slate-800">
							<div
								className={`h-2 rounded-full ${color} transition-all duration-500`}
								style={{ width: `${ratio}%` }}
							/>
						</div>
					</article>
				);
			})}
		</section>
	);
}
