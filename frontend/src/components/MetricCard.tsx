import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatNumber } from "../utils/format";

type MetricCardProps = {
	label: string;
	value: number;
	unit?: string;
	isDanger?: boolean;
	accent?: "primary" | "accent" | "warning" | "danger" | "success";
	to?: string;
};

const accentClasses: Record<NonNullable<MetricCardProps["accent"]>, string> = {
	primary: "text-primary",
	accent: "text-accent",
	warning: "text-warning",
	danger: "text-danger",
	success: "text-success",
};

const toneClasses: Record<NonNullable<MetricCardProps["accent"]>, string> = {
	primary: "border-primary/35 bg-[linear-gradient(135deg,rgba(30,58,138,0.28),rgba(15,23,42,0.92))]",
	accent: "border-accent/40 bg-[linear-gradient(135deg,rgba(8,145,178,0.22),rgba(15,23,42,0.92))]",
	warning: "border-warning/40 bg-[linear-gradient(135deg,rgba(180,83,9,0.2),rgba(15,23,42,0.92))]",
	danger: "border-danger/40 bg-[linear-gradient(135deg,rgba(153,27,27,0.22),rgba(15,23,42,0.92))]",
	success: "border-success/40 bg-[linear-gradient(135deg,rgba(5,150,105,0.2),rgba(15,23,42,0.92))]",
};

const orbClasses: Record<NonNullable<MetricCardProps["accent"]>, string> = {
	primary: "bg-primary/25",
	accent: "bg-accent/25",
	warning: "bg-warning/20",
	danger: "bg-danger/22",
	success: "bg-success/22",
};

export default function MetricCard({
	label,
	value,
	unit = "",
	isDanger = false,
	accent = "primary",
	to,
}: MetricCardProps) {
	const card = (
		<motion.article
			layout
			whileHover={{ scale: 1.02, y: -3 }}
			transition={{ type: "spring", stiffness: 320, damping: 24 }}
			className={`relative overflow-hidden rounded-3xl border p-5 shadow-panel transition ${toneClasses[accent]} ${
				isDanger ? "shadow-glowDanger" : "shadow-glowSuccess"
			} ${to ? "cursor-pointer" : ""}`}
		>
			<div className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl ${orbClasses[accent]}`} />
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
			<p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Real-time telemetry</p>
		</motion.article>
	);

	if (!to) {
		return card;
	}

	return (
		<Link to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl">
			{card}
		</Link>
	);
}
