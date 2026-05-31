import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { Check, X, Shield, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/policies")({
  head: () => ({ meta: [{ title: "Policies — AgentTripwire" }] }),
  component: Policies,
});

const POLICIES = [
  { title: "Block secrets sent to unapproved external domains", impact: "block", desc: "Any payload matching secret patterns (sk-*, password, token) cannot leave the allowlisted domains." },
  { title: "Require user consent before sharing customer data", impact: "consent", desc: "Any tool call carrying customer PII to a third-party tool triggers a consent prompt." },
  { title: "Block destructive shell commands from untrusted content", impact: "block", desc: "rm -rf, drop database, etc. originating from browser_content or tool_output are blocked." },
  { title: "Rewrite tool calls with unnecessary sensitive data", impact: "rewrite", desc: "Strip fields not required by the user task before forwarding the call." },
  { title: "Allow read-only browser actions", impact: "allow", desc: "Read-only browser navigation and extraction allowed without consent." },
];

function Policies() {
  return (
    <SiteLayout>
      <SectionBlock eyebrow="Policy library" title="Default policy rules" subtitle="The shipped baseline policies. All can be customized per agent.">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[color:var(--risk-shareable)]"><Check className="mr-1.5 inline h-4 w-4" /> Approved domains</h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["acmevendor.com", "internal.local", "crm.internal", "*.lovable.app"].map((d) => (
                <span key={d} className="rounded-md border border-[color:var(--risk-shareable)]/30 bg-[color:var(--risk-shareable)]/10 px-2 py-1 font-mono text-[color:var(--risk-shareable)]">{d}</span>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[color:var(--risk-high)]"><X className="mr-1.5 inline h-4 w-4" /> Blocked domains</h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["attacker.example", "*.suspicious.tld", "data-broker.io"].map((d) => (
                <span key={d} className="rounded-md border border-[color:var(--risk-high)]/30 bg-[color:var(--risk-high)]/10 px-2 py-1 font-mono text-[color:var(--risk-high)]">{d}</span>
              ))}
            </div>
          </GlassCard>
          {["Sensitive data rules", "Secret detection rules", "User consent rules", "Destructive command rules"].map((title) => (
            <GlassCard key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]"><Shield className="mr-1.5 inline h-4 w-4" /> {title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">Configurable detectors and thresholds for {title.toLowerCase()}.</p>
            </GlassCard>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock eyebrow="Rules" title="Active policy rules">
        <div className="space-y-3">
          {POLICIES.map((p, i) => {
            const color =
              p.impact === "block" ? "var(--risk-high)"
              : p.impact === "consent" ? "var(--risk-consent)"
              : p.impact === "rewrite" ? "var(--risk-sensitive)"
              : "var(--risk-shareable)";
            return (
              <GlassCard key={i} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `color-mix(in oklab, ${color} 20%, transparent)` }}>
                    <AlertTriangle className="h-4 w-4" style={{ color }} />
                  </div>
                  <div>
                    <h4 className="font-medium">{p.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider" style={{ borderColor: `color-mix(in oklab, ${color} 40%, transparent)`, color }}>
                  {p.impact}
                </span>
              </GlassCard>
            );
          })}
        </div>
      </SectionBlock>
    </SiteLayout>
  );
}
