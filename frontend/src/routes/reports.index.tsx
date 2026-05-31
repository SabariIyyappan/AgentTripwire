import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { RiskBadge, DecisionBadge } from "@/components/RiskBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SAMPLE_REPORTS } from "@/lib/tripwire";
import { ArrowUpRight, Clock, Check, X, Shield, AlertTriangle, FileText, BookLock } from "lucide-react";

export const Route = createFileRoute("/reports/")({
  head: () => ({ meta: [{ title: "Safety Reports & Policies — AgentTripwire" }] }),
  component: Reports,
});

const POLICIES = [
  { title: "Block secrets sent to unapproved external domains", impact: "block", desc: "Any payload matching secret patterns (sk-*, password, token) cannot leave the allowlisted domains." },
  { title: "Require user consent before sharing customer data", impact: "consent", desc: "Any tool call carrying customer PII to a third-party tool triggers a consent prompt." },
  { title: "Block destructive shell commands from untrusted content", impact: "block", desc: "rm -rf, drop database, etc. originating from browser_content or tool_output are blocked." },
  { title: "Rewrite tool calls with unnecessary sensitive data", impact: "rewrite", desc: "Strip fields not required by the user task before forwarding the call." },
  { title: "Allow read-only browser actions", impact: "allow", desc: "Read-only browser navigation and extraction allowed without consent." },
];

function Reports() {
  return (
    <SiteLayout>
      <SectionBlock
        eyebrow="Reports & Policies"
        title="Observability and governance"
        subtitle="Every intercepted call generates an auditable report, governed by your policy rules."
      >
        <Tabs defaultValue="reports" className="w-full">
          <div className="mb-10 flex justify-center">
            <TabsList className="h-11 gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">
              <TabsTrigger value="reports" className="gap-2 rounded-lg px-5 py-2 data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-none">
                <FileText className="h-4 w-4" /> Safety Reports
              </TabsTrigger>
              <TabsTrigger value="policies" className="gap-2 rounded-lg px-5 py-2 data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-none">
                <BookLock className="h-4 w-4" /> Policies
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ----- Reports tab ----- */}
          <TabsContent value="reports">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_REPORTS.map((r) => (
                <GlassCard key={r.id} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-muted-foreground">{r.id}</code>
                    <DecisionBadge decision={r.decision} />
                  </div>
                  <h3 className="text-base font-semibold leading-tight">{r.scenario}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <RiskBadge level={r.riskLevel} /> <span className="font-mono">{r.riskScore}/100</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="text-foreground/70">Attempted tool</div>
                    <code className="text-[color:var(--neon-cyan)]">{r.attemptedTool}</code>
                    {r.attemptedDestination && <div className="mt-1 break-all font-mono">{r.attemptedDestination}</div>}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(r.createdAt).toLocaleString()}</span>
                    <Link to="/reports/$id" params={{ id: r.id }} className="inline-flex items-center gap-1 text-[color:var(--neon-cyan)] hover:underline">
                      View report <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          {/* ----- Policies tab ----- */}
          <TabsContent value="policies">
            <div className="space-y-10">
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

              <div>
                <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">Active policy rules</h3>
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SectionBlock>
    </SiteLayout>
  );
}
