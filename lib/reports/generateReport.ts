import { randomUUID } from "crypto";
import type { Run, SafetyReport, TraceStep, TripwireAnalysis } from "@/lib/types";
import { upsertReport } from "@/lib/storage/memory";

export function generateReport(run: Run): SafetyReport {
  const blockedSteps = run.trace.filter((s) => s.outcome === "blocked");
  const allowedSteps = run.trace.filter((s) => s.outcome === "success");

  const allAnalyses: TripwireAnalysis[] = run.trace
    .map((s: TraceStep) => s.analysis)
    .filter((a): a is TripwireAnalysis => a !== undefined);

  const allPiiFindings = allAnalyses.flatMap((a) => a.piiDetection.findings);

  const highestRisk = allAnalyses.reduce(
    (max, a) => {
      const order = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
      return order.indexOf(a.riskClassification.level) > order.indexOf(max)
        ? a.riskClassification.level
        : max;
    },
    "LOW" as SafetyReport["attackSummary"]["riskLevel"]
  );

  const lastBlock = blockedSteps[blockedSteps.length - 1];
  const lastBlockAnalysis = lastBlock?.analysis;

  const narrative = buildNarrative(run, blockedSteps, allPiiFindings.length);

  const report: SafetyReport = {
    id: randomUUID(),
    runId: run.id,
    scenarioId: run.scenarioId,
    mode: run.mode,
    generatedAt: new Date().toISOString(),
    attackSummary: {
      attackType: run.scenarioId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      riskLevel: highestRisk,
      action: lastBlockAnalysis?.decision ?? "ALLOW",
      dataAtRisk: allPiiFindings.map((f) => f.type),
      decisionReason:
        lastBlockAnalysis?.reason ?? "No risky tool calls detected.",
    },
    toolCallsTotal: run.trace.filter((s) => s.toolCall !== undefined).length,
    toolCallsBlocked: blockedSteps.length,
    toolCallsAllowed: allowedSteps.length,
    piiFindings: allPiiFindings,
    narrative,
  };

  upsertReport(report);
  return report;
}

function buildNarrative(
  run: Run,
  blockedSteps: TraceStep[],
  piiCount: number
): string {
  const modeLabel = run.mode === "protected" ? "Protected" : "Unprotected";
  const blocked = blockedSteps.length;

  if (run.mode === "unprotected") {
    return (
      `[${modeLabel} Run] The agent executed scenario "${run.scenarioId}" without any safety layer. ` +
      `${piiCount > 0 ? `${piiCount} PII finding(s) were exposed.` : "No PII was explicitly detected."} ` +
      `All ${run.trace.filter((s) => s.toolCall).length} tool call(s) proceeded unchecked.`
    );
  }

  return (
    `[${modeLabel} Run] AgentTripwire intercepted the agent during scenario "${run.scenarioId}". ` +
    `${blocked} tool call(s) were blocked before execution. ` +
    `${piiCount > 0 ? `${piiCount} PII finding(s) were prevented from leaving the system.` : ""} ` +
    `The agent was stopped before any data could be exfiltrated.`
  );
}
