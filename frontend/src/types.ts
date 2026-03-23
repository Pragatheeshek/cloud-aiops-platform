export type Severity = "warning" | "critical";
export type IncidentStatus = "open" | "resolved";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Incident {
  id: string;
  tenant_id: string;
  metric_id: string;
  alerts: string[];
  root_cause: string;
  severity: Severity;
  sla_risk_score: number;
  risk_level: RiskLevel;
  ai_action: string;
  status: IncidentStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface DashboardStats {
  total_incidents: number;
  critical_incidents: number;
  resolved_incidents: number;
  average_resolution_time_seconds: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
