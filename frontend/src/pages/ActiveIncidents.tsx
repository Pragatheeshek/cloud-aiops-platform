import { useCallback } from "react";
import { AnimatePresence } from "framer-motion";

import IncidentCard from "../components/IncidentCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents } from "../services/api";

const POLLING_MS = 3000;

export default function ActiveIncidents() {
  const loadIncidents = useCallback(() => fetchIncidents(), []);
  const { data, isLoading, error, lastUpdated } = usePolling(loadIncidents, POLLING_MS);

  const activeIncidents = (data ?? []).filter((incident) => String(incident.status).toLowerCase() === "open");

  return (
    <div className="space-y-4">
      <section className="panel-soft rounded-2xl p-5">
        <h3 className="text-2xl font-bold text-text">Active Incidents</h3>
        <p className="mt-1 text-sm text-slate-400">
          Live open incidents with urgency highlighting
          {lastUpdated ? ` • ${lastUpdated.toLocaleTimeString()}` : ""}
        </p>
      </section>

      {error ? (
        <p className="rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {activeIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} emphasize showAiProcessing />
            ))}
          </AnimatePresence>
          {activeIncidents.length === 0 ? (
            <p className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
              No active incidents found.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
