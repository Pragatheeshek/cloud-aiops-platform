import { useCallback } from "react";

import LoadingSkeleton from "../components/LoadingSkeleton";
import TimelineComponent from "../components/TimelineComponent";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents } from "../services/api";
import { formatDateTime } from "../utils/format";

const POLLING_MS = 3000;

function confidenceFromIncident(slaRiskScore: number, severity: string): number {
  const severityBoost = severity.toLowerCase() === "critical" ? 10 : severity.toLowerCase() === "warning" ? 4 : 0;
  return Math.max(55, Math.min(99, Math.round(100 - slaRiskScore + severityBoost)));
}

export default function AIDecisions() {
  const loadIncidents = useCallback(() => fetchIncidents(), []);
  const { data, isLoading, error } = usePolling(loadIncidents, POLLING_MS);

  const incidents = data ?? [];
  const recent = incidents.slice(0, 8);

  const events = recent.map((incident) => {
    const confidence = confidenceFromIncident(incident.sla_risk_score, String(incident.severity));
    return {
      id: incident.id,
      title: incident.root_cause,
      detail: `Decision: ${incident.ai_action.split("_").join(" ")} • Confidence ${confidence}%`,
      timestamp: formatDateTime(incident.created_at),
      tone: confidence >= 80 ? ("success" as const) : confidence >= 65 ? ("warning" as const) : ("accent" as const),
    };
  });

  return (
    <div className="space-y-4">
      <section className="panel-soft rounded-2xl p-5">
        <h3 className="text-2xl font-bold text-text">AI Decision Engine</h3>
        <p className="mt-1 text-sm text-slate-400">Root cause detection, AI actions, and confidence scoring.</p>
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
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {recent.slice(0, 3).map((incident) => {
              const confidence = confidenceFromIncident(incident.sla_risk_score, String(incident.severity));
              return (
                <article key={incident.id} className="panel-soft rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Detected Root Cause</p>
                  <p className="mt-2 text-sm font-semibold text-text">{incident.root_cause}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">AI Decision</p>
                  <p className="mt-1 text-sm text-slate-300">{incident.ai_action.split("_").join(" ")}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-500">Confidence</p>
                  <p className="mt-1 text-2xl font-bold text-accent">{confidence}%</p>
                </article>
              );
            })}
          </div>
          <TimelineComponent title="Decision Timeline" events={events} />
        </>
      )}
    </div>
  );
}
