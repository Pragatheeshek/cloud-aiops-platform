import { useCallback } from "react";

import IncidentList from "../components/IncidentList";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents } from "../services/api";

const POLLING_MS = 3000;

export default function Incidents() {
	const loadIncidents = useCallback(() => fetchIncidents(), []);
	const { data, isLoading, error, lastUpdated } = usePolling(loadIncidents, POLLING_MS);

	return (
		<div className="space-y-4">
			<div className="panel-soft rounded-2xl p-5">
				<div className="flex flex-wrap items-end justify-between gap-2">
					<h3 className="text-2xl font-bold text-text">AI Incident Stream</h3>
					<p className="text-sm text-slate-400">
						Auto-refresh every 3 seconds
						{lastUpdated ? ` • ${lastUpdated.toLocaleTimeString()}` : ""}
					</p>
				</div>
			</div>

			{error ? (
				<p className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
			) : null}

			{isLoading ? (
				<div className="space-y-3">
					<LoadingSkeleton className="h-28" />
					<LoadingSkeleton className="h-28" />
					<LoadingSkeleton className="h-28" />
				</div>
			) : (
				<IncidentList incidents={data ?? []} emptyText="No incidents found" />
			)}
		</div>
	);
}
