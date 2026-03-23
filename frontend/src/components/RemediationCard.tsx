import { Bot, Sparkles } from "lucide-react";

import type { Incident } from "../types";

export default function RemediationCard({ incident }: { incident: Incident }) {
	return (
		<article className="rounded-2xl border border-slate-700 bg-card/90 p-5 shadow-panel transition hover:border-accent/40 hover:bg-slate-800/80">
			<div className="mb-3 flex items-center justify-between">
				<span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
					{incident.severity}
				</span>
				<Bot size={16} className="text-slate-400" />
			</div>

			<h3 className="text-lg font-semibold text-slate-100">{incident.ai_action.split("_").join(" ")}</h3>
			<p className="mt-2 text-sm text-slate-300">{incident.root_cause}</p>

			<div className="mt-4 flex items-center justify-between text-xs text-slate-400">
				<span className="flex items-center gap-1">
					<Sparkles size={13} className="text-accent" />
					SLA score: {incident.sla_risk_score}
				</span>
				<span>{incident.status}</span>
			</div>
		</article>
	);
}
