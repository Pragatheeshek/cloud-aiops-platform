type StatusTone = "success" | "warning" | "danger" | "neutral";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  pulse?: boolean;
};

const toneClassMap: Record<StatusTone, string> = {
  success: "border-success/40 bg-success/15 text-success",
  warning: "border-warning/40 bg-warning/15 text-warning",
  danger: "border-danger/40 bg-danger/15 text-danger",
  neutral: "border-slate-700 bg-slate-900/80 text-slate-300",
};

export default function StatusBadge({ label, tone = "neutral", pulse = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneClassMap[tone]} ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      {label}
    </span>
  );
}
