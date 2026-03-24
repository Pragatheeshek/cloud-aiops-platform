import { motion } from "framer-motion";

import { formatNumber } from "../utils/format";

type MetricCardProps = {
	label: string;
	value: number;
	unit?: string;
	isDanger?: boolean;
	accent?: "primary" | "accent" | "warning" | "danger" | "success";
};

const accentClasses: Record<NonNullable<MetricCardProps["accent"]>, string> = {
	primary: "text-primary",
	accent: "text-accent",
	warning: "text-warning",
	danger: "text-danger",
	success: "text-success",
};

export default function MetricCard({
	label,
	value,
	unit = "",
	isDanger = false,
	accent = "primary",
}: MetricCardProps) {
	return (
		<motion.article
			layout
			whileHover={{ scale: 1.02, y: -3 }}
			transition={{ type: "spring", stiffness: 320, damping: 24 }}
			className={`rounded-2xl border bg-card p-5 shadow-panel transition ${
				isDanger ? "border-danger/45 shadow-glowDanger" : "border-success/35 shadow-glowSuccess"
			}`}
		>
			<p className="text-sm font-medium text-slate-400">{label}</p>
			<motion.p
				key={`${label}-${value}`}
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.22 }}
				className={`mt-3 text-4xl font-bold ${accentClasses[accent]}`}
			>
				{formatNumber(value)}
				{unit}
			</motion.p>
		</motion.article>
	);
}
