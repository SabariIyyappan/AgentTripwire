import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { User, Bot, Shield, Wrench, Cloud, Bug, Repeat, Activity, Database, Globe2 } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture — AgentTripwire" }] }),
  component: Architecture,
});

function Node({ title, items, icon: Icon, accent }: { title: string; items: string[]; icon: any; accent: string }) {
  return (
    <div className="rounded-2xl glass p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: `var(--${accent})` }} />
        <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: `var(--${accent})` }}>{title}</h4>
      </div>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {items.map((i) => <li key={i} className="flex gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />{i}</li>)}
      </ul>
    </div>
  );
}

function Architecture() {
  return (
    <SiteLayout>
      <SectionBlock
        eyebrow="System architecture"
        title="The AgentTripwire safety gateway"
        subtitle="User Interface → Agent Orchestrator → Tripwire Gateway → Risk + Policy Engine → Tool Execution Layer → Reports & Storage"
      >
        <div className="grid gap-4 lg:grid-cols-5">
          <Node title="User / Judge Interface" icon={User} accent="neon-cyan"
            items={["Web Dashboard", "Scenario selector", "Live trace", "Run unprotected", "Run with Tripwire", "Safety report"]} />
          <Node title="Agent Orchestrator" icon={Bot} accent="neon-cyan"
            items={["LLM planner & reasoning loop", "Maintains context", "Proposes tool calls"]} />
          <div className="lg:col-span-1 rounded-2xl glass-strong p-4 ring-glow">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-[color:var(--neon-cyan)]" />
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]">Tripwire MCP Proxy / Safety Gateway</h4>
            </div>
            <ul className="space-y-1 text-xs">
              {["Context Builder", "Risk Classifier", "Secret & PII Detector", "Policy Engine", "Explanation Generator"].map((i) => (
                <li key={i} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-foreground/80">{i}</li>
              ))}
            </ul>
          </div>
          <Node title="Tool Execution Layer" icon={Wrench} accent="neon-purple"
            items={["Browser / Web", "HTTP / API", "Database / CRM", "Shell / Code", "Email / Messaging", "Signing / Wallet"]} />
          <Node title="Sponsor Integrations" icon={Cloud} accent="neon-green"
            items={["Opsera MCP", "Daytona", "Rtrvr.ai", "Apify", "Tigris Data", "Insforge", "NEAR AI", "Render"]} />
        </div>

        {/* arrow row */}
        <div className="my-6 grid grid-cols-4 items-center gap-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="border-t border-dashed border-[color:var(--neon-cyan)]/50">request</div>
          <div className="border-t border-dashed border-[color:var(--neon-cyan)]/50">propose call</div>
          <div className="border-t border-dashed border-[color:var(--risk-shareable)]/50">approved</div>
          <div className="border-t border-dashed border-[color:var(--risk-high)]/50">blocked</div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Node title="Attack Scenario Packs" icon={Bug} accent="risk-high"
            items={["Prompt Injection", "Data Exfiltration", "Destructive Command", "More Scenarios"]} />
          <Node title="Replay Harness" icon={Repeat} accent="neon-cyan"
            items={["Unprotected Run vs Protected Run"]} />
          <Node title="Observability & Reporting" icon={Activity} accent="neon-purple"
            items={["Session Recorder", "Attack Analyzer", "Audit Logger", "Report Generator"]} />
          <Node title="External World / Untrusted" icon={Globe2} accent="risk-high"
            items={["Malicious Websites", "External Webhooks", "Untrusted Content"]} />
        </div>

        <div className="mt-4">
          <Node title="Data & Artifact Storage" icon={Database} accent="neon-green"
            items={["Traces & Logs", "Screenshots & Recordings", "Tool Call History", "Policies & Configs", "Safety Reports"]} />
        </div>

        {/* Legend */}
        <GlassCard className="mt-8">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Data flow legend</h4>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {[
              ["Shareable", "var(--risk-shareable)"],
              ["Low Sensitive", "var(--risk-low)"],
              ["Sensitive", "var(--risk-sensitive)"],
              ["Requires Consent", "var(--risk-consent)"],
              ["High Risk / Blocked", "var(--risk-high)"],
            ].map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="h-2 w-6 rounded-full" style={{ background: color }} /> {label}
              </span>
            ))}
          </div>
        </GlassCard>
      </SectionBlock>
    </SiteLayout>
  );
}
