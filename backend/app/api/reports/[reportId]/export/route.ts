import { NextResponse } from "next/server";
import { getReport } from "@/lib/storage/memory";
import type { ApiResponse, SafetyReport } from "@/lib/types";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ reportId: string }>;
}

interface JsonExportData {
  format: "json";
  report: SafetyReport;
}

interface MarkdownExportData {
  format: "markdown";
  markdown: string;
}

type ExportData = JsonExportData | MarkdownExportData;

function buildMarkdown(report: SafetyReport): string {
  const lines: string[] = [];

  lines.push("# AgentTripwire Safety Report");
  lines.push("");
  lines.push(`- **Report ID:** ${report.id}`);
  lines.push(`- **Run ID:** ${report.runId}`);
  lines.push(`- **Scenario:** ${report.scenarioId}`);
  lines.push(`- **Mode:** ${report.mode}`);
  lines.push(`- **Generated At:** ${report.generatedAt}`);
  lines.push("");

  lines.push("## Attack Summary");
  lines.push("");
  lines.push(`- **Attack Type:** ${report.attackSummary.attackType}`);
  lines.push(`- **Risk Level:** ${report.attackSummary.riskLevel}`);
  lines.push(`- **Decision / Action:** ${report.attackSummary.action}`);
  lines.push(`- **Data At Risk:** ${report.attackSummary.dataAtRisk.join(", ")}`);
  lines.push(`- **Reason:** ${report.attackSummary.decisionReason}`);
  lines.push("");

  lines.push("## Tool Call Statistics");
  lines.push("");
  lines.push(`- **Total Tool Calls:** ${report.toolCallsTotal}`);
  lines.push(`- **Blocked:** ${report.toolCallsBlocked}`);
  lines.push(`- **Allowed:** ${report.toolCallsAllowed}`);
  lines.push("");

  if (report.piiFindings.length > 0) {
    lines.push("## PII Findings");
    lines.push("");
    for (const finding of report.piiFindings) {
      lines.push(`- **${finding.type}** in field \`${finding.field}\`: \`${finding.excerpt}\``);
    }
    lines.push("");
  }

  if (report.narrative) {
    lines.push("## Narrative");
    lines.push("");
    lines.push(report.narrative);
    lines.push("");
  }

  lines.push("## Recommended Policy Hardening");
  lines.push("");
  lines.push("- Block all outbound HTTP POST requests to unapproved domains.");
  lines.push("- Treat browser-extracted content as untrusted — never execute embedded instructions.");
  lines.push("- Require explicit human approval for any shell command execution.");
  lines.push("- Apply data-classification checks before any CRM data leaves the system boundary.");
  lines.push("");

  return lines.join("\n");
}

export async function GET(
  req: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<ExportData>>> {
  const { reportId } = await context.params;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "markdown";

  const report = getReport(reportId);
  if (!report) {
    return NextResponse.json(
      { ok: false, error: `Report "${reportId}" not found.` },
      { status: 404 }
    );
  }

  if (format === "json") {
    return NextResponse.json({
      ok: true,
      data: { format: "json" as const, report },
    });
  }

  return NextResponse.json({
    ok: true,
    data: { format: "markdown" as const, markdown: buildMarkdown(report) },
  });
}
