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

type ChartComponentProps = {
  title: string;
  data: MetricTrendPoint[];
  keys?: Array<{ key: "cpu" | "memory" | "network" | "error"; name: string; color: string }>;
};

const defaultKeys: Array<{ key: "cpu" | "memory" | "network" | "error"; name: string; color: string }> = [
  { key: "cpu", name: "CPU", color: "#3B82F6" },
  { key: "memory", name: "Memory", color: "#22D3EE" },
  { key: "network", name: "Network", color: "#10B981" },
  { key: "error", name: "Error", color: "#EF4444" },
];

function formatTick(value: number): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
}

export default function ChartComponent({ title, data, keys = defaultKeys }: ChartComponentProps) {
  return (
    <section className="panel-soft rounded-2xl p-5">
      <h3 className="mb-4 text-lg font-bold text-text">{title}</h3>
      <div className="h-72 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-3">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="text-lg font-semibold text-slate-200">Awaiting telemetry samples</p>
              <p className="mt-1 text-sm text-slate-400">This chart will auto-populate from live polling.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
              {keys.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={450}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
