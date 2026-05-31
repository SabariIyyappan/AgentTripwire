import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GlassCard, SectionBlock } from "@/components/GlassCard";
import { RiskBadge, DecisionBadge } from "@/components/RiskBadge";
import { RiskGauge } from "@/components/RiskGauge";
import { SAMPLE_REPORTS } from "@/lib/tripwire";
import { api } from "@/lib/api/client";
import { mapBackendReport, type FrontendReport } from "@/lib/api/adapters";
import { Download, ArrowLeft, Clock, Wifi } from "lucide-react";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/reports/$id")({
  head: ({ params }) => ({ meta: [{ title: `Report ${params.id} — AgentTripwire` }] }),
  loader: async ({ params }): Promise<{ report: FrontendReport; isLive: boolean }> => {
    const { id } = params;

    // Try fetching a live report from the backend if the ID is a UUID
    if (UUID_RE.test(id)) {
      try {
        const backendReport = await api.getReport(id);
        return { report: mapBackendReport(backendReport), isLive: true };
      } catch {
        // Fall through to sample reports
      }
    }

    const sample = SAMPLE_REPORTS.find((r) => r.id === id);
    if (!sample) throw notFound();
    return { report: sample as FrontendReport, isLive: false };
  },
  component: ReportDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center text-muted-foreground">Report not found.</div>
    </SiteLayout>
  ),
});

function ReportDetail() {
  const { report, isLive } = Route.useLoaderData() as { report: FrontendReport; isLive: boolean };

  return (
    <SiteLayout>
      <SectionBlock>
        <div className="mb-4 flex items-center justify-between">
          <Link to="/reports" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> All reports
          </Link>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-[color:var(--neon-cyan)]">
              <Wifi className="h-3 w-3" /> Live from backend
            </span>
          )}
        </div>

        <GlassCard glow className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Safety report · {report.id}</div>
              <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{report.scenario}</h1>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <DecisionBadge decision={report.decision} />
              <RiskBadge level={report.riskLevel} />
            </div>
          </div>

          <RiskGauge score={report.riskScore} />

          <div className="grid gap-4 md:grid-cols-2">
            <Block k="Attack type" v={report.attackType} />
            <Block k="Attempted tool" v={report.attemptedTool} mono />
            <Block k="Destination" v={report.attemptedDestination ?? "—"} mono />
            <Block k="Replay result" v={report.replayResult} />
          </div>

          {report.dataDetected.length > 0 && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Data detected</div>
              <div className="flex flex-wrap gap-1.5">
                {report.dataDetected.map((d) => (
                  <span key={d} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-[color:var(--neon-cyan)]">{d}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Reasons</div>
            <ul className="space-y-1.5 text-sm">
              {report.reasons.map((r) => <li key={r} className="text-muted-foreground">• {r}</li>)}
            </ul>
          </div>

          {report.matchedPolicies.length > 0 && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Matched policies</div>
              <div className="flex flex-wrap gap-1.5">
                {report.matchedPolicies.map((p) => (
                  <span key={p} className="rounded-md bg-[color:var(--neon-purple)]/15 px-2 py-0.5 text-[11px] font-mono text-[color:var(--neon-purple)]">{p}</span>
                ))}
              </div>
            </div>
          )}

          {report.safeAlternative && (
            <div className="rounded-lg border border-[color:var(--risk-shareable)]/30 bg-[color:var(--risk-shareable)]/5 p-3 text-sm">
              <span className="font-medium text-[color:var(--risk-shareable)]">Safe alternative: </span>
              <span className="text-muted-foreground">{report.safeAlternative}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {isLive && (
              <a
                href={`/api/reports/${report.id}/export?format=markdown`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                <Download className="h-4 w-4" /> Export Markdown
              </a>
            )}
            <a
              href={`data:application/json,${encodeURIComponent(JSON.stringify(report, null, 2))}`}
              download={`${report.id}.json`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              <Download className="h-4 w-4" /> Export JSON
            </a>
          </div>
        </GlassCard>
      </SectionBlock>
    </SiteLayout>
  );
}

function Block({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className={`mt-1 ${mono ? "font-mono text-sm break-all" : "text-sm"}`}>{v}</div>
    </div>
  );
}
