import { useCallback } from "react";

import LoadingSkeleton from "../components/LoadingSkeleton";
import StatusBadge from "../components/StatusBadge";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents } from "../services/api";

const POLLING_MS = 3000;

function riskTone(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "danger";
  if (score >= 40) return "warning";
  return "success";
}

export default function SLAMonitor() {
  const loadIncidents = useCallback(() => fetchIncidents(), []);
  const { data, isLoading, error } = usePolling(loadIncidents, POLLING_MS);
  const incidents = data ?? [];

  return (
    <div className="space-y-4">
      <section className="panel-soft rounded-2xl p-5">
        <h3 className="text-2xl font-bold text-text">SLA Monitor</h3>
        <p className="mt-1 text-sm text-slate-400">Risk score monitoring per incident with low/medium/high visualization.</p>
      </section>

      {error ? (
        <p className="rounded-2xl border border-danger/35 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          <LoadingSkeleton className="h-24" />
          <LoadingSkeleton className="h-24" />
          <LoadingSkeleton className="h-24" />
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => {
            const score = Math.max(0, Math.min(100, incident.sla_risk_score));
            const tone = riskTone(score);
            return (
              <article key={incident.id} className="panel-soft rounded-2xl p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text">{incident.root_cause}</p>
                  <StatusBadge label={`${score}%`} tone={tone} />
                </div>
                <div className="h-2.5 rounded-full bg-slate-800/85">
                  <div
                    className={`h-2.5 rounded-full ${
                      tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-warning" : "bg-success"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">{score < 40 ? "Low" : score < 70 ? "Medium" : "High"} risk</p>
              </article>
            );
          })}
          {incidents.length === 0 ? (
            <p className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">No incidents found.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
