import { motion } from "framer-motion";
import { Bot, ShieldCheck, ShieldOff, Globe, Check, AlertTriangle, HandCoins, Ban, ArrowRight, HelpCircle } from "lucide-react";
import type { ComponentType } from "react";
import type { TripwireDecision } from "@/lib/tripwire";
import { cn } from "@/lib/utils";

export type FlowMode = "idle" | "unprotected" | "protected";

const OUTCOMES = {
  safe: { label: "Safe", color: "var(--risk-shareable)", Icon: Check },
  warning: { label: "Warning", color: "var(--risk-low)", Icon: AlertTriangle },
  consent: { label: "Ask Consent", color: "var(--risk-consent)", Icon: HandCoins },
  high_risk: { label: "High Risk", color: "var(--risk-high)", Icon: Ban },
  leaked: { label: "Data Leaked", color: "var(--risk-high)", Icon: AlertTriangle },
  executed: { label: "Executed", color: "var(--risk-shareable)", Icon: Check },
} as const;

type OutcomeKey = keyof typeof OUTCOMES;

const LEGEND: { key: OutcomeKey; }[] = [
  { key: "safe" }, { key: "warning" }, { key: "consent" }, { key: "high_risk" },
];

function resolveOutcome(mode: FlowMode, decision: TripwireDecision | null): OutcomeKey | null {
  if (mode === "idle" || !decision) return null;
  if (mode === "protected") {
    switch (decision.decision) {
      case "allow": return "safe";
      case "allow_with_warning": return "warning";
      case "require_user_consent":
      case "rewrite": return "consent";
      default: return "high_risk";
    }
  }
  const risky = decision.decision === "block" || decision.decision === "require_user_consent" || decision.decision === "rewrite";
  return risky ? "leaked" : "executed";
}

function Packet({ active, color, delay }: { active: boolean; color: string; delay: number }) {
  return (
    <div className="relative mx-1 hidden h-px min-w-6 flex-1 self-center bg-white/10 sm:block">
      {active && (
        <motion.span
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: 1.4, ease: "linear" }}
        />
      )}
      <ArrowRight className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/25" />
    </div>
  );
}

function Node({
  icon: Icon, label, color, dim, ring, blocked,
}: {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; color: string; dim?: boolean; ring?: boolean; blocked?: boolean;
}) {
  return (
    <div className={cn("flex w-[84px] shrink-0 flex-col items-center gap-1.5", dim && "opacity-40")}>
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-xl glass"
        style={{ boxShadow: ring ? `0 0 22px -4px ${color}` : undefined, borderColor: ring ? color : undefined }}
      >
        {ring && <motion.span className="absolute inset-0 rounded-xl border" style={{ borderColor: color }} animate={{ opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />}
        <Icon className="relative h-6 w-6" style={{ color }} />
        {blocked && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--risk-high)] text-white">
            <Ban className="h-3 w-3" />
          </span>
        )}
      </div>
      <span className="text-center text-[10px] leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}

export function LiveScanFlow({ mode, decision, runKey }: { mode: FlowMode; decision: TripwireDecision | null; runKey: number }) {
  const protectedMode = mode === "protected";
  const running = mode !== "idle";
  const outcome = resolveOutcome(mode, decision);
  const blocked = protectedMode && decision?.decision === "block";
  const oc = outcome ? OUTCOMES[outcome] : null;
  const flowColor = oc?.color ?? "var(--neon-cyan)";
  const ResultIcon = oc?.Icon ?? HelpCircle;
  const resultColor = oc?.color ?? "var(--muted-foreground)";
  const revealDelay = blocked ? 0.7 : 1.3;

  return (
    <div key={runKey} className="w-full">
      <div className="flex items-start justify-between gap-1">
        <Node icon={Bot} label="AI Agent" color="var(--neon-cyan)" ring={running} />
        <Packet active={running} color={flowColor} delay={0} />
        <Node
          icon={protectedMode ? ShieldCheck : ShieldOff}
          label={protectedMode ? "AgentTripwire" : "No Firewall"}
          color={protectedMode ? "var(--neon-cyan)" : "var(--risk-high)"}
          ring={protectedMode && running}
          dim={!protectedMode}
          blocked={blocked}
        />
        <Packet active={running && !blocked} color={flowColor} delay={0.5} />
        <Node icon={Globe} label="Browser / Tool" color="var(--neon-cyan)" dim={blocked} />
        <Packet active={running && !blocked} color={flowColor} delay={1} />
        {/* result */}
        <motion.div
          className="flex w-[84px] shrink-0 flex-col items-center gap-1.5"
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={running ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
          transition={{ delay: revealDelay }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in oklab, ${resultColor} 18%, transparent)`, border: `1px solid ${resultColor}`, boxShadow: running ? `0 0 22px -4px ${resultColor}` : undefined }}
          >
            <ResultIcon className="h-6 w-6" style={{ color: resultColor }} />
          </div>
          <span className="text-center text-[10px] font-medium leading-tight" style={{ color: resultColor }}>{oc?.label ?? "Result"}</span>
        </motion.div>
      </div>

      {/* outcome legend — the four possible verdicts */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {LEGEND.map(({ key }) => {
          const o = OUTCOMES[key];
          const isActive = outcome === key || (key === "high_risk" && outcome === "leaked") || (key === "safe" && outcome === "executed");
          return (
            <span
              key={key}
              className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition", isActive ? "" : "opacity-45")}
              style={{ borderColor: isActive ? o.color : "var(--border)", color: isActive ? o.color : "var(--muted-foreground)", background: isActive ? "rgba(255,255,255,0.05)" : "transparent" }}
            >
              <o.Icon className="h-3.5 w-3.5" /> {o.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
