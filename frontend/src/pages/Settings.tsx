import { useEffect, useState } from "react";

import RemediationCard from "../components/RemediationCard";
import { loadIncidents } from "../store/incidentStore";
import type { Incident } from "../types";

const REFRESH_INTERVAL_MS = 3000;

export default function AiActions() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				const data = await loadIncidents();
				if (mounted) {
					setIncidents(data);
					setLastUpdated(new Date());
				}
			} finally {
				if (mounted) setIsLoading(false);
			}
		};

		void load();
		const intervalId = setInterval(() => {
			void load();
		}, REFRESH_INTERVAL_MS);

		return () => {
			mounted = false;
			clearInterval(intervalId);
		};
	}, []);

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-xl font-semibold">AI Actions</h2>
				<p className="text-sm text-slate-400">
					Autonomous actions executed by the decision engine
					{lastUpdated ? ` • Updated ${lastUpdated.toLocaleTimeString()}` : ""}.
				</p>
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
