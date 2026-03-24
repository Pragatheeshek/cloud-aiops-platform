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

import type { MetricTrendPoint } from "../types";

type TrendChartProps = {
	data: MetricTrendPoint[];
	title: string;
	showNetworkAndError?: boolean;
};

export default function TrendChart({ data, title, showNetworkAndError = false }: TrendChartProps) {
	return (
		<section className="panel-soft rounded-2xl p-5">
			<h3 className="mb-4 text-lg font-bold text-text">{title}</h3>
			<div className="h-72 w-full rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
						<XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
						<YAxis stroke="#94A3B8" fontSize={12} />
						<Tooltip
							contentStyle={{
								backgroundColor: "#0B1220",
								border: "1px solid #334155",
								borderRadius: "12px",
								color: "#E5E7EB",
							}}
						/>
						<Legend />
						<Line
							type="monotone"
							dataKey="cpu"
							name="CPU"
							stroke="#3B82F6"
							strokeWidth={2.5}
							dot={false}
							isAnimationActive
							animationDuration={450}
						/>
						<Line
							type="monotone"
							dataKey="memory"
							name="Memory"
							stroke="#22D3EE"
							strokeWidth={2.5}
							dot={false}
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
