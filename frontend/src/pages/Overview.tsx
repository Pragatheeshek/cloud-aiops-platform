import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ChartComponent from "../components/ChartComponent";
import IncidentCard from "../components/IncidentCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import StatusBadge from "../components/StatusBadge";
import { useMetricHistory } from "../hooks/useMetricHistory";
import { usePolling } from "../hooks/usePolling";
import { fetchDashboardStats, fetchIncidents, fetchLatestMetric } from "../services/api";

const POLLING_MS = 3000;

export default function Overview() {
  const navigate = useNavigate();
  const loadStats = useCallback(() => fetchDashboardStats(), []);
  const loadIncidents = useCallback(() => fetchIncidents(), []);
  const loadMetric = useCallback(() => fetchLatestMetric(), []);

  const statsState = usePolling(loadStats, POLLING_MS);
  const incidentsState = usePolling(loadIncidents, POLLING_MS);
  const metricState = usePolling(loadMetric, POLLING_MS);
  const history = useMetricHistory(metricState.data, 12);

  const incidents = incidentsState.data ?? [];
  const stats = statsState.data;

  const cards = [
    {
      label: "Total Incidents",
      value: stats?.total_incidents ?? incidents.length,
      tone: "neutral" as const,
      to: "/incidents",
    },
    {
      label: "Active Incidents",
      value:
        stats?.total_incidents !== undefined && stats?.resolved_incidents !== undefined
          ? stats.total_incidents - stats.resolved_incidents
          : incidents.filter((item) => String(item.status).toLowerCase() === "open").length,
      tone: "warning" as const,
      to: "/incidents/active",
    },
    { label: "Resolved Incidents", value: stats?.resolved_incidents ?? 0, tone: "success" as const, to: "/incidents/resolved" },
    {
      label: "SLA Risk %",
      value:
        incidents.length === 0
          ? 0
          : Math.round(
              incidents.reduce((total, incident) => total + incident.sla_risk_score, 0) /
                Math.max(incidents.length, 1),
            ),
      tone: "danger" as const,
      to: "/sla-monitor",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsState.isLoading ? (
          <>
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
          </>
        ) : (
          cards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate(card.to)}
              className="panel-soft w-full rounded-2xl p-5 text-left transition active:scale-[0.98]"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-2 text-4xl font-bold text-text">{card.value}</p>
              <div className="mt-3">
                <StatusBadge label={card.tone === "neutral" ? "stable" : card.tone} tone={card.tone} />
              </div>
            </button>
          ))
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartComponent
          title="CPU and Memory Snapshot"
          data={history}
          keys={[
            { key: "cpu", name: "CPU", color: "#3B82F6" },
            { key: "memory", name: "Memory", color: "#22D3EE" },
          ]}
        />
        <div className="panel-soft rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text">Recent Incidents</h3>
            <StatusBadge label="preview" tone="neutral" />
          </div>
          <div className="space-y-3">
            {(incidentsState.data ?? []).slice(0, 4).map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
            {!incidentsState.isLoading && incidents.length === 0 ? (
              <p className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-400">
                No incidents found.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
