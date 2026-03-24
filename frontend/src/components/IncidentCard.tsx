import { motion } from "framer-motion";

import type { Incident } from "../types";
import { formatDateTime, normalizeSeverity, normalizeStatus } from "../utils/format";
import StatusBadge from "./StatusBadge";

type IncidentCardProps = {
  incident: Incident;
  showAiProcessing?: boolean;
  emphasize?: boolean;
};

function actionLabel(action: string): string {
  return action.split("_").join(" ");
}

function estimateResolutionMinutes(incident: Incident): number {
  const action = String(incident.ai_action).toLowerCase();
  if (action === "restart_service") return 8;
  if (action === "scale_resources") return 12;
  if (action === "throttle_traffic") return 10;
  if (action === "optimize_load") return 14;

  const severity = String(incident.severity).toLowerCase();
  if (severity === "critical") return 18;
  if (severity === "warning") return 28;
  return 35;
}

function expectedResolutionTime(incident: Incident): string {
  const createdAt = new Date(incident.created_at).getTime();
  if (Number.isNaN(createdAt)) return "Soon";

  const etaMs = estimateResolutionMinutes(incident) * 60_000;
  return formatDateTime(new Date(createdAt + etaMs).toISOString());
}

function severityTone(value: string): "danger" | "warning" | "success" {
  if (value === "CRITICAL") return "danger";
  if (value === "WARNING") return "warning";
  return "success";
}

function statusTone(value: string): "danger" | "success" {
  return value === "OPEN" ? "danger" : "success";
}

export default function IncidentCard({ incident, showAiProcessing = false, emphasize = false }: IncidentCardProps) {
  const severity = normalizeSeverity(incident.severity);
  const status = normalizeStatus(incident.status);
  const action = actionLabel(incident.ai_action);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className={`rounded-2xl border p-4 shadow-panel ${
        emphasize ? "border-danger/40 bg-danger/10" : "border-slate-800 bg-card"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">{incident.root_cause}</p>
          <p className="mt-1 text-xs text-slate-400">AI action: {action}</p>
          <p className="mt-1 text-xs text-slate-500">Created: {formatDateTime(incident.created_at)}</p>
          {status === "RESOLVED" && incident.resolved_at ? (
            <>
              <p className="mt-1 text-xs text-slate-300">Resolved when: {formatDateTime(incident.resolved_at)}</p>
              <p className="mt-1 text-xs text-slate-300">Resolved how: {action}</p>
            </>
          ) : (
            <>
              <p className="mt-1 text-xs text-slate-300">Expected resolve by: {expectedResolutionTime(incident)}</p>
              <p className="mt-1 text-xs text-slate-300">Resolution method: {action}</p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={severity} tone={severityTone(severity)} pulse={emphasize && severity === "CRITICAL"} />
          <StatusBadge label={status} tone={statusTone(status)} />
          <StatusBadge label={`SLA ${incident.sla_risk_score}`} tone="neutral" />
          {showAiProcessing && status === "OPEN" ? <StatusBadge label="AI Processing" tone="warning" pulse /> : null}
        </div>
      </div>
    </motion.article>
  );
}
