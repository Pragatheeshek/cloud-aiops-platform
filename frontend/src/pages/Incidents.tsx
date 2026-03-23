import { useEffect, useState } from "react";

import IncidentTable from "../components/IncidentTable";
import { loadIncidents } from "../store/incidentStore";
import type { Incident } from "../types";

export default function Incidents() {
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
		<div className="rounded-2xl border border-slate-700 bg-card/90 p-6 shadow-panel">
			<div className="mb-4 flex items-end justify-between">
				<h2 className="text-xl font-semibold">Incidents</h2>
				<span className="text-sm text-slate-400">Tenant scoped</span>
			</div>

			{isLoading ? (
				<p className="text-sm text-slate-400">Loading incidents...</p>
			) : (
				<IncidentTable incidents={incidents} />
			)}
		</div>
	);
}
