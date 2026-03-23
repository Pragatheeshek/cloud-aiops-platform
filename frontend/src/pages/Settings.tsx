import { useEffect, useState } from "react";

import RemediationCard from "../components/RemediationCard";
import { loadIncidents } from "../store/incidentStore";
import type { Incident } from "../types";

export default function AiActions() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				const data = await loadIncidents();
				if (mounted) setIncidents(data);
			} finally {
				if (mounted) setIsLoading(false);
			}
		};

		void load();

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-xl font-semibold">AI Actions</h2>
				<p className="text-sm text-slate-400">Autonomous actions executed by the decision engine.</p>
			</div>

			{isLoading ? (
				<p className="text-sm text-slate-400">Loading AI action history...</p>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{incidents.map((incident) => (
						<RemediationCard key={incident.id} incident={incident} />
					))}
				</div>
			)}
		</div>
	);
}
