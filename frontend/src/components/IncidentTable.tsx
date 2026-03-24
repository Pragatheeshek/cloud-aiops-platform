import type { Incident } from "../types";
import { formatDateTime } from "../utils/format";

function severityBadge(severity: Incident["severity"]) {
	if (severity === "critical") {
		return "bg-danger/20 text-danger border-danger/40";
	}
	if (severity === "normal") {
		return "bg-success/20 text-success border-success/40";
	}
	return "bg-warning/20 text-warning border-warning/40";
}

function statusBadge(status: Incident["status"]) {
	if (status === "resolved") {
		return "bg-success/20 text-success border-success/40";
	}
	return "bg-warning/20 text-warning border-warning/40";
}

export default function IncidentTable({ incidents }: { incidents: Incident[] }) {
	if (!incidents.length) {
		return <p className="text-sm text-slate-400">No incidents found.</p>;
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full text-left text-sm">
				<thead>
					<tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
						<th className="pb-3 pr-4">Severity</th>
						<th className="pb-3 pr-4">Root Cause</th>
						<th className="pb-3 pr-4">AI Action</th>
						<th className="pb-3 pr-4">SLA Risk</th>
						<th className="pb-3 pr-4">Status</th>
						<th className="pb-3 pr-4">Created Time</th>
					</tr>
				</thead>
				<tbody>
					{incidents.map((incident) => (
						<tr key={incident.id} className="border-b border-slate-800/70 align-top">
							<td className="py-4 pr-4">
								<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge(incident.severity)}`}>
									{incident.severity}
								</span>
							</td>
							<td className="py-4 pr-4 text-slate-300">{incident.root_cause}</td>
							<td className="py-4 pr-4 text-slate-200">{incident.ai_action.split("_").join(" ")}</td>
							<td className="py-4 pr-4 text-slate-200">{incident.sla_risk_score}</td>
							<td className="py-4 pr-4">
								<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(incident.status)}`}>
									{incident.status}
								</span>
							</td>
							<td className="py-4 pr-4 text-slate-400">{formatDateTime(incident.created_at)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
