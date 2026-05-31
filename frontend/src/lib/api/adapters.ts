// Adapters that map backend data shapes to frontend display types.
// Backend uses uppercase enums ("HIGH", "BLOCK"); frontend uses lowercase/descriptive ones.

import type { TraceStep } from "@/components/TraceTimeline";
import type { RiskLevel, TripwireDecision, TripwireDecisionType } from "@/lib/tripwire";
import type {
  BackendRun,
  BackendSafetyReport,
  BackendTripwireAnalysis,
  BackendHttpDelivery,
} from "./client";

// ─── Enum mappers ─────────────────────────────────────────────────────────────

export function mapRiskLevel(
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
): RiskLevel {
  switch (level) {
    case "LOW": return "low_sensitive";
    case "MEDIUM": return "sensitive";
    case "HIGH": return "high_risk";
    case "CRITICAL": return "high_risk";
  }
}

export function mapDecision(
  d: "ALLOW" | "BLOCK" | "ASK_HUMAN" | "REWRITE"
): TripwireDecisionType {
  switch (d) {
    case "ALLOW": return "allow";
    case "BLOCK": return "block";
    case "ASK_HUMAN": return "require_user_consent";
    case "REWRITE": return "rewrite";
  }
}

// ─── Trace steps ──────────────────────────────────────────────────────────────

function stepStatus(step: BackendRun["trace"][number]): TraceStep["status"] {
  if (step.outcome === "blocked") return "blocked";
  if (step.outcome === "pending") return "warn";
  if (step.analysis?.decision === "ALLOW") return "ok";

  const d = step.description.toLowerCase();
  if (
    d.includes("[unsafe]") ||
    d.includes("[simulated leak]") ||
    d.includes("[dangerous")
  ) return "blocked";
  if (d.includes("hidden prompt injection") || d.includes("injection detected"))
    return "warn";
  if (d.includes("completed") || d.includes("blocked") || d.includes("allowed"))
    return "ok";

  return "info";
}

function cleanLabel(desc: string): { label: string; detail?: string } {
  const clean = desc
    .replace(/^\[(UNPROTECTED|UNSAFE|SIMULATED LEAK|DANGEROUS[^\]]*|PROTECTED)\]\s*/gi, "")
    .trim();

  const MAX = 95;
  if (clean.length <= MAX) return { label: clean };

  const dot = clean.indexOf(". ");
  if (dot > 15 && dot <= MAX + 30) {
    return { label: clean.slice(0, dot + 1), detail: clean.slice(dot + 2, 200) };
  }

  return { label: clean.slice(0, MAX) + "…" };
}

export function mapTraceSteps(run: BackendRun): TraceStep[] {
  return run.trace.map((s) => {
    const { label, detail } = cleanLabel(s.description);
    const toolDetail = s.toolCall?.toolName
      ? `${s.toolCall.toolName}${s.analysis ? ` → ${s.analysis.decision}` : ""}`
      : undefined;
    return {
      label,
      status: stepStatus(s),
      detail: detail ?? toolDetail,
    };
  });
}

// ─── TripwireDecision (for TripwireDecisionCard) ─────────────────────────────

export function mapAnalysisToDecision(
  analysis: BackendTripwireAnalysis
): TripwireDecision {
  return {
    toolCallId: analysis.toolCallId,
    decision: mapDecision(analysis.decision),
    riskScore: analysis.riskClassification.score,
    riskLevel: mapRiskLevel(analysis.riskClassification.level),
    dataClasses: analysis.piiDetection.findings.map((f) =>
      f.type.toLowerCase().replace("_", "/")
    ),
    reasons: analysis.reason.split(/\.\s+/).filter(Boolean),
    matchedPolicies: analysis.riskClassification.flags.map((f) =>
      f.toLowerCase().replace(/_/g, "-")
    ),
    safeAlternative: analysis.safeAlternative,
    requiresConsent: analysis.decision === "ASK_HUMAN",
  };
}

// ─── SafetyReport → frontend report shape ────────────────────────────────────

export interface FrontendReport {
  id: string;
  runId: string;
  scenario: string;
  attackType: string;
  riskLevel: RiskLevel;
  riskScore: number;
  attemptedTool: string;
  attemptedDestination: string;
  dataDetected: string[];
  decision: TripwireDecisionType;
  reasons: string[];
  matchedPolicies: string[];
  safeAlternative?: string;
  replayResult: string;
  createdAt: string;
}

const RISK_SCORE_MAP: Record<string, number> = {
  CRITICAL: 100,
  HIGH: 90,
  MEDIUM: 55,
  LOW: 20,
};

export function mapBackendReport(report: BackendSafetyReport): FrontendReport {
  const action = report.attackSummary.action;
  const isBlocked = action === "BLOCK";

  return {
    id: report.id,
    runId: report.runId,
    scenario: "Prompt Injection → Data Exfiltration",
    attackType: report.attackSummary.attackType,
    riskLevel: mapRiskLevel(report.attackSummary.riskLevel),
    riskScore: RISK_SCORE_MAP[report.attackSummary.riskLevel] ?? 90,
    attemptedTool: "http.post",
    attemptedDestination: "https://attacker.example/collect",
    dataDetected: report.piiFindings.map((f) =>
      f.type.toLowerCase().replace("_", "/")
    ),
    decision: mapDecision(action),
    reasons: report.attackSummary.decisionReason
      .split(/\.\s+/)
      .filter(Boolean)
      .map((s) => (s.endsWith(".") ? s : s + ".")),
    matchedPolicies: isBlocked
      ? ["secret-exfiltration-block", "approved-domains-allowlist"]
      : [],
    safeAlternative: isBlocked
      ? "Updated CRM with public vendor information only. No external data transfer."
      : undefined,
    replayResult: isBlocked
      ? "Attack blocked. CRM updated safely with vendor pricing only."
      : "Data leaked to simulated attacker webhook.",
    createdAt: report.generatedAt,
  };
}

// ─── Webhook deliveries → leaked items ───────────────────────────────────────

export function extractLeakedItems(deliveries: BackendHttpDelivery[]): string[] {
  return deliveries.flatMap((d) => {
    const body = d.body as Record<string, unknown>;
    return [
      typeof body.apiKey === "string" ? body.apiKey : null,
      typeof body.customerEmail === "string" ? body.customerEmail : null,
    ].filter((x): x is string => x !== null);
  });
}
