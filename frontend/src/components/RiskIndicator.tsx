import type { RiskLevel } from "../types";

const styles: Record<RiskLevel, string> = {
	LOW: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
	MEDIUM: "border-amber-500/40 bg-amber-500/15 text-amber-300",
	HIGH: "border-red-500/40 bg-red-500/15 text-red-300",
};

export default function RiskIndicator({ level }: { level: RiskLevel }) {
	return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[level]}`}>{level}</span>;
}
