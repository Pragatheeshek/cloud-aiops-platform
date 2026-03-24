import { useCallback, useEffect, useState } from "react";

import LoadingSkeleton from "../components/LoadingSkeleton";
import StatusBadge from "../components/StatusBadge";
import { usePolling } from "../hooks/usePolling";
import { fetchHealth, fetchServiceHealth } from "../services/api";

const POLLING_MS = 3000;

type ServiceBlock = {
  name: string;
  status: "healthy" | "degraded" | "critical";
  detail: string;
};

function toneFromStatus(status: ServiceBlock["status"]): "success" | "warning" | "danger" {
  if (status === "healthy") return "success";
  if (status === "degraded") return "warning";
  return "danger";
}

export default function SystemHealth() {
  const loadHealth = useCallback(() => fetchHealth(), []);
  const loadServiceHealth = useCallback(() => fetchServiceHealth(), []);
  const [selectedServiceName, setSelectedServiceName] = useState<string>("API");

  const healthState = usePolling(loadHealth, POLLING_MS);
  const serviceState = usePolling(loadServiceHealth, POLLING_MS);

  const services: ServiceBlock[] = serviceState.data ?? [
    { name: "API", status: "healthy", detail: "Request gateway operational" },
    { name: "Database", status: "healthy", detail: "MongoDB reachable" },
    { name: "AI Engine", status: "healthy", detail: "Inference queue available" },
  ];

  useEffect(() => {
    if (!services.some((service) => service.name === selectedServiceName)) {
      setSelectedServiceName(services[0]?.name ?? "API");
    }
  }, [selectedServiceName, services]);

  const selectedService = services.find((service) => service.name === selectedServiceName) ?? services[0] ?? null;

  const overall: "Healthy" | "Degraded" | "Critical" =
    healthState.error || String(healthState.data?.status).toLowerCase() !== "ok"
      ? "Critical"
      : services.some((service) => service.status === "degraded")
        ? "Degraded"
        : services.some((service) => service.status === "critical")
          ? "Critical"
          : "Healthy";

  return (
    <div className="space-y-4">
      <section className="panel-soft rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-text">System Health</h3>
            <p className="mt-1 text-sm text-slate-400">Overall platform status and core service blocks.</p>
          </div>
          <StatusBadge
            label={overall}
            tone={overall === "Healthy" ? "success" : overall === "Degraded" ? "warning" : "danger"}
            pulse={overall !== "Healthy"}
          />
        </div>
      </section>

      {healthState.isLoading || serviceState.isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <LoadingSkeleton className="h-36" />
          <LoadingSkeleton className="h-36" />
          <LoadingSkeleton className="h-36" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => {
              const isSelected = selectedServiceName === service.name;
              return (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => setSelectedServiceName(service.name)}
                  className={`panel-soft rounded-2xl p-5 text-left transition active:scale-[0.98] ${
                    isSelected ? "ring-2 ring-accent/45" : ""
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-lg font-semibold text-text">{service.name}</p>
                    <StatusBadge label={service.status} tone={toneFromStatus(service.status)} />
                  </div>
                  <p className="text-sm text-slate-400">{service.detail}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">Tap for details</p>
                </button>
              );
            })}
          </div>

          {selectedService ? (
            <section className="panel-soft rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-text">{selectedService.name} Diagnostics</h4>
                <StatusBadge label={selectedService.status} tone={toneFromStatus(selectedService.status)} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{selectedService.detail}</p>
              <p className="mt-2 text-xs text-slate-500">
                Last heartbeat {serviceState.lastUpdated ? serviceState.lastUpdated.toLocaleTimeString() : "pending"}
              </p>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
