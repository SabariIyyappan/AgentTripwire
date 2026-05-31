import type { TripwireDecision } from "@/lib/tripwire";
import { GlassCard } from "./GlassCard";
import { RiskBadge, DecisionBadge } from "./RiskBadge";
import { RiskGauge } from "./RiskGauge";
import { ShieldCheck } from "lucide-react";

export function TripwireDecisionCard({
  decision,
  toolName,
  destination,
}: {
  decision: TripwireDecision;
  toolName: string;
  destination?: string;
}) {
  return (
    <GlassCard glow className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--neon-cyan)]" />
            Tripwire Decision
          </div>
          <h3 className="mt-1 text-xl font-semibold">{toolName}</h3>
          {destination && <div className="text-xs text-muted-foreground font-mono break-all">{destination}</div>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <DecisionBadge decision={decision.decision} />
          <RiskBadge level={decision.riskLevel} />
        </div>
      </div>
      <RiskGauge score={decision.riskScore} />
      <div>
        <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Detected data</div>
        <div className="flex flex-wrap gap-1.5">
          {decision.dataClasses.length === 0 ? (
            <span className="text-xs text-muted-foreground">No sensitive data</span>
          ) : (
            decision.dataClasses.map((d) => (
              <span key={d} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-[color:var(--neon-cyan)]">{d}</span>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Reasons</div>
        <ul className="space-y-1.5 text-sm">
          {decision.reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--neon-cyan)]" />
              <span className="text-muted-foreground">{r}</span>
            </li>
          ))}
        </ul>
      </div>
      {decision.matchedPolicies.length > 0 && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Matched policies</div>
          <div className="flex flex-wrap gap-1.5">
            {decision.matchedPolicies.map((p) => (
              <span key={p} className="rounded-md bg-[color:var(--neon-purple)]/15 px-2 py-0.5 text-[11px] font-mono text-[color:var(--neon-purple)]">{p}</span>
            ))}
          </div>
        </div>
      )}
      {decision.safeAlternative && (
        <div className="rounded-lg border border-[color:var(--risk-shareable)]/30 bg-[color:var(--risk-shareable)]/5 p-3 text-sm">
          <span className="font-medium text-[color:var(--risk-shareable)]">Safe alternative: </span>
          <span className="text-muted-foreground">{decision.safeAlternative}</span>
        </div>
      )}
    </GlassCard>
  );
}
