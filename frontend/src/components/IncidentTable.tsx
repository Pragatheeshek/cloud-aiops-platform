import RiskIndicator from "./RiskIndicator";
import type { Incident } from "../types";

function severityBadge(severity: Incident["severity"]) {
	if (severity === "critical") {
		return "bg-critical/20 text-critical border-critical/40";
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
		return <p className="text-sm text-slate-400">No incidents detected for this tenant.</p>;
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full text-left text-sm">
				<thead>
					<tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
						<th className="pb-3 pr-4">Alerts</th>
						<th className="pb-3 pr-4">Severity</th>
						<th className="pb-3 pr-4">Root Cause</th>
						<th className="pb-3 pr-4">AI Action</th>
						<th className="pb-3 pr-4">SLA Risk</th>
						<th className="pb-3 pr-4">Status</th>
					</tr>
				</thead>
				<tbody>
					{incidents.map((incident) => (
						<tr key={incident.id} className="border-b border-slate-800/70 align-top">
							<td className="py-4 pr-4 text-slate-200">{incident.alerts.join(", ")}</td>
							<td className="py-4 pr-4">
								<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge(incident.severity)}`}>
									{incident.severity}
								</span>
							</td>
							<td className="py-4 pr-4 text-slate-300">{incident.root_cause}</td>
							<td className="py-4 pr-4 text-slate-200">{incident.ai_action.split("_").join(" ")}</td>
							<td className="py-4 pr-4">
								<div className="flex items-center gap-2">
									<RiskIndicator level={incident.risk_level} />
									<span className="text-xs text-slate-400">{incident.sla_risk_score}</span>
								</div>
							</td>
							<td className="py-4 pr-4">
								<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(incident.status)}`}>
									{incident.status}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
