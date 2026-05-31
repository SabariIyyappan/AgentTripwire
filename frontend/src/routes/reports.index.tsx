import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { RiskBadge, DecisionBadge } from "@/components/RiskBadge";
import { SAMPLE_REPORTS } from "@/lib/tripwire";
import { ArrowUpRight, Clock } from "lucide-react";

export const Route = createFileRoute("/reports/")({
  head: () => ({ meta: [{ title: "Safety Reports — AgentTripwire" }] }),
  component: Reports,
});

function Reports() {
  return (
    <SiteLayout>
      <SectionBlock eyebrow="Reports" title="Safety reports" subtitle="Every intercepted call generates an auditable report.">
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
      </SectionBlock>
    </SiteLayout>
  );
}
