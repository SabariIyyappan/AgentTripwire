import { cn } from "@/lib/utils";
import type { RiskLevel, TripwireDecisionType } from "@/lib/tripwire";

const RISK: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  shareable: {
    label: "Shareable",
    color: "text-[color:var(--risk-shareable)]",
    bg: "bg-[color:var(--risk-shareable)]/15 border-[color:var(--risk-shareable)]/40",
  },
  low_sensitive: {
    label: "Low Sensitive",
    color: "text-[color:var(--risk-low)]",
    bg: "bg-[color:var(--risk-low)]/15 border-[color:var(--risk-low)]/40",
  },
  sensitive: {
    label: "Sensitive",
    color: "text-[color:var(--risk-sensitive)]",
    bg: "bg-[color:var(--risk-sensitive)]/15 border-[color:var(--risk-sensitive)]/40",
  },
  requires_consent: {
    label: "Requires Consent",
    color: "text-[color:var(--risk-consent)]",
    bg: "bg-[color:var(--risk-consent)]/15 border-[color:var(--risk-consent)]/40",
  },
  high_risk: {
    label: "High Risk",
    color: "text-[color:var(--risk-high)]",
    bg: "bg-[color:var(--risk-high)]/15 border-[color:var(--risk-high)]/40",
  },
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const r = RISK[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider",
        r.bg,
        r.color,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
      {r.label}
    </span>
  );
}

export function DecisionBadge({ decision }: { decision: TripwireDecisionType }) {
  const map: Record<TripwireDecisionType, { label: string; cls: string }> = {
    allow: { label: "Allow", cls: "text-[color:var(--risk-shareable)] border-[color:var(--risk-shareable)]/40" },
    allow_with_warning: { label: "Allow + Warn", cls: "text-[color:var(--risk-low)] border-[color:var(--risk-low)]/40" },
    require_user_consent: { label: "Need Consent", cls: "text-[color:var(--risk-consent)] border-[color:var(--risk-consent)]/40" },
    rewrite: { label: "Rewrite", cls: "text-[color:var(--risk-sensitive)] border-[color:var(--risk-sensitive)]/40" },
    block: { label: "Blocked", cls: "text-[color:var(--risk-high)] border-[color:var(--risk-high)]/40" },
  };
  const m = map[decision];
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-white/5", m.cls)}>
      {m.label}
    </span>
  );
}
