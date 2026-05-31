import { motion } from "framer-motion";
import { Check, X, AlertTriangle, Activity } from "lucide-react";

export type TraceStep = {
  label: string;
  status: "ok" | "warn" | "blocked" | "info";
  detail?: string;
};

export function TraceTimeline({ steps }: { steps: TraceStep[] }) {
  return (
    <ol className="relative space-y-3 pl-6">
      <div className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
      {steps.map((s, i) => {
        const Icon = s.status === "ok" ? Check : s.status === "warn" ? AlertTriangle : s.status === "blocked" ? X : Activity;
        const colorVar =
          s.status === "ok" ? "--risk-shareable"
          : s.status === "warn" ? "--risk-consent"
          : s.status === "blocked" ? "--risk-high"
          : "--neon-cyan";
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <span
              className="absolute -left-[18px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-[color:var(--background)]"
              style={{ background: `color-mix(in oklab, var(${colorVar}) 30%, transparent)`, color: `var(${colorVar})` }}
            >
              <Icon className="h-2.5 w-2.5" />
            </span>
            <div className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
              <div className="text-sm font-medium">{s.label}</div>
              {s.detail && <div className="mt-0.5 text-xs text-muted-foreground">{s.detail}</div>}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
