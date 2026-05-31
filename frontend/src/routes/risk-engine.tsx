import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { RiskGauge } from "@/components/RiskGauge";
import { RiskBadge, DecisionBadge } from "@/components/RiskBadge";
import { inspect, ATTACK_TOOL_CALL, type ToolCall } from "@/lib/tripwire";

export const Route = createFileRoute("/risk-engine")({
  head: () => ({ meta: [{ title: "Risk Engine — AgentTripwire" }] }),
  component: RiskEngine,
});

const RULES = [
  ["+15", "Source is untrusted browser content"],
  ["+20", "Destination is external"],
  ["+25", "Destination domain not on allowlist"],
  ["+30", "Payload contains email / customer data"],
  ["+40", "Payload contains API key, token, password, or secret"],
  ["+40", "Action is destructive"],
  ["+25", "Action is irreversible"],
  ["+20", "Action not necessary for the user task"],
  ["+15", "Data importance is high"],
];

const SAMPLES: ToolCall[] = [
  ATTACK_TOOL_CALL,
  {
    id: "tc_2", toolName: "crm.update", args: {}, source: "user", destinationDomain: "crm.internal",
    actionType: "write", payload: "vendor pricing summary", importance: "low", necessity: "required",
  },
  {
    id: "tc_3", toolName: "email.send", args: {}, source: "user", destinationDomain: "api.thirdparty-mail.com",
    actionType: "external_transfer", payload: "Hi sarah@example.com, here is the customer pricing", importance: "high", necessity: "useful",
  },
];

function RiskEngine() {
  return (
    <SiteLayout>
      <SectionBlock
        eyebrow="Risk Engine"
        title="Every tool call gets a 0–100 risk score"
        subtitle="Based on data sensitivity, source trust, destination, importance, necessity, and action type."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-base font-semibold">Scoring rules</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {RULES.map(([weight, rule]) => (
                <li key={rule} className="flex items-start justify-between gap-3 rounded-md border border-white/5 bg-white/[0.03] p-2.5">
                  <span className="text-muted-foreground">{rule}</span>
                  <span className="font-mono text-[color:var(--neon-cyan)]">{weight}</span>
                </li>
              ))}
              <li className="text-xs text-muted-foreground">Score capped at 100.</li>
            </ul>
          </GlassCard>
          <GlassCard glow>
            <h3 className="text-base font-semibold">Decision thresholds</h3>
            <div className="mt-4 space-y-3">
              {[
                ["0–19", "ALLOW", "shareable"],
                ["20–39", "ALLOW + WARN", "low_sensitive"],
                ["40–59", "REQUIRE CONSENT", "sensitive"],
                ["60–79", "REQUIRE CONSENT / REWRITE", "requires_consent"],
                ["80–100", "BLOCK", "high_risk"],
              ].map(([r, decision, level]) => (
                <div key={r} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <span className="font-mono text-sm">{r}</span>
                  <RiskBadge level={level as any} />
                  <span className="text-xs font-medium uppercase tracking-wider text-foreground/70">{decision}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <RiskGauge score={100} />
            </div>
          </GlassCard>
        </div>
      </SectionBlock>

      <SectionBlock eyebrow="Examples" title="Sample tool-call inspections">
        <div className="grid gap-4 md:grid-cols-3">
          {SAMPLES.map((c) => {
            const d = inspect(c);
            return (
              <GlassCard key={c.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-semibold">{c.toolName}</code>
                  <DecisionBadge decision={d.decision} />
                </div>
                <div className="text-xs text-muted-foreground font-mono break-all">{c.destinationDomain}</div>
                <RiskGauge score={d.riskScore} />
                <div className="flex flex-wrap gap-1.5">
                  {d.dataClasses.length === 0 ? <span className="text-xs text-muted-foreground">no sensitive data</span> :
                    d.dataClasses.map((dc) => <span key={dc} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-[color:var(--neon-cyan)]">{dc}</span>)
                  }
                </div>
                <RiskBadge level={d.riskLevel} />
              </GlassCard>
            );
          })}
        </div>
      </SectionBlock>
    </SiteLayout>
  );
}
