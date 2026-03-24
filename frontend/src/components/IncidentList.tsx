import { AnimatePresence, motion } from "framer-motion";

import type { Incident } from "../types";
import { formatDateTime, normalizeSeverity, normalizeStatus } from "../utils/format";

type IncidentListProps = {
	incidents: Incident[];
	emptyText?: string;
};

function severityClass(value: string) {
	if (value === "CRITICAL") return "border-danger/40 bg-danger/15 text-danger";
	if (value === "NORMAL") return "border-success/40 bg-success/15 text-success";
	return "border-warning/40 bg-warning/15 text-warning";
}

function statusClass(value: string) {
	return value === "RESOLVED"
		? "border-success/40 bg-success/15 text-success"
		: "border-danger/40 bg-danger/15 text-danger";
}

export default function IncidentList({ incidents, emptyText = "No incidents found" }: IncidentListProps) {
	if (!incidents.length) {
		return <p className="rounded-2xl border border-slate-800 bg-card p-4 text-sm text-slate-400">{emptyText}</p>;
	}

	return (
		<div className="space-y-3">
			<AnimatePresence>
				{incidents.map((incident) => {
					const severity = normalizeSeverity(incident.severity);
					const status = normalizeStatus(incident.status);

					return (
						<motion.article
							layout
							key={incident.id}
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.28 }}
							className="rounded-2xl border border-slate-800 bg-card p-4 shadow-panel"
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-sm font-semibold text-text">{incident.root_cause}</p>
									<p className="mt-1 text-xs text-slate-400">
										AI action: {incident.ai_action.split("_").join(" ")}
									</p>
									<p className="mt-1 text-xs text-slate-500">Created: {formatDateTime(incident.created_at)}</p>
								</div>
								<div className="flex flex-wrap gap-2">
									<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityClass(severity)}`}>
										{severity}
									</span>
									<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(status)}`}>
										{status}
									</span>
									<span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
										SLA {incident.sla_risk_score}
									</span>
								</div>
							</div>
						</motion.article>
					);
				})}
			</AnimatePresence>
		</div>
	);
}
