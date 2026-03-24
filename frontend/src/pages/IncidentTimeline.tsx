import { useCallback } from "react";

import LoadingSkeleton from "../components/LoadingSkeleton";
import TimelineComponent from "../components/TimelineComponent";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents } from "../services/api";
import { formatDateTime } from "../utils/format";

const POLLING_MS = 3000;

export default function IncidentTimeline() {
  const loadIncidents = useCallback(() => fetchIncidents(), []);
  const { data, isLoading, error } = usePolling(loadIncidents, POLLING_MS);

  const incidents = data ?? [];

  const timelineEvents = incidents.slice(0, 10).flatMap((incident) => {
    const createdTime = formatDateTime(incident.created_at);
    const detectionTime = formatDateTime(new Date(new Date(incident.created_at).getTime() + 30_000).toISOString());
    const decisionTime = formatDateTime(new Date(new Date(incident.created_at).getTime() + 60_000).toISOString());

    const events: Array<{
      id: string;
      title: string;
      detail: string;
      timestamp: string;
      tone: "primary" | "accent" | "success" | "warning";
    }> = [
      {
        id: `${incident.id}-created`,
        title: "Incident Created",
        detail: incident.root_cause,
        timestamp: createdTime,
        tone: "warning" as const,
      },
      {
        id: `${incident.id}-detected`,
        title: "AI Detection",
        detail: `Alerts: ${incident.alerts.join(", ") || "none"}`,
        timestamp: detectionTime,
        tone: "accent" as const,
      },
      {
        id: `${incident.id}-decision`,
        title: "Decision Applied",
        detail: incident.ai_action.split("_").join(" "),
        timestamp: decisionTime,
        tone: "primary" as const,
      },
    ];

    if (incident.resolved_at) {
      events.push({
        id: `${incident.id}-resolved`,
        title: "Resolution Completed",
        detail: `Status ${incident.status}`,
        timestamp: formatDateTime(incident.resolved_at),
        tone: "success" as const,
      });
    }

    return events;
  });

  return (
    <div className="space-y-4">
      <section className="panel-soft rounded-2xl p-5">
        <h3 className="text-2xl font-bold text-text">Incident Timeline</h3>
        <p className="mt-1 text-sm text-slate-400">Lifecycle view from creation to AI resolution.</p>
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
        <TimelineComponent title="Lifecycle Events" events={timelineEvents} />
      )}
    </div>
  );
}
