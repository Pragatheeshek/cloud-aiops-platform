import { motion } from "framer-motion";

type TimelineEvent = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  tone?: "primary" | "accent" | "success" | "warning";
};

type TimelineComponentProps = {
  title: string;
  events: TimelineEvent[];
};

function dotClass(tone: TimelineEvent["tone"]): string {
  if (tone === "accent") return "bg-accent";
  if (tone === "success") return "bg-success";
  if (tone === "warning") return "bg-warning";
  return "bg-primary";
}

export default function TimelineComponent({ title, events }: TimelineComponentProps) {
  return (
    <section className="panel-soft rounded-2xl p-5">
      <h3 className="mb-4 text-lg font-bold text-text">{title}</h3>
      {events.length === 0 ? (
        <p className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 text-sm text-slate-400">
          No timeline events found.
        </p>
      ) : (
        <ol className="space-y-4">
          {events.map((event) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3"
            >
              <div className="relative pt-1">
                <span className={`inline-flex h-3 w-3 rounded-full ${dotClass(event.tone)}`} />
                <span className="absolute left-[5px] top-4 h-full w-px bg-slate-700" />
              </div>
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3">
                <p className="text-sm font-semibold text-text">{event.title}</p>
                <p className="mt-1 text-xs text-slate-400">{event.detail}</p>
                <p className="mt-1 text-[11px] text-slate-500">{event.timestamp}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}
