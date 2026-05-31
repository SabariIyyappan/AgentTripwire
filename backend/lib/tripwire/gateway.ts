import { randomUUID } from "crypto";
import type { TripwireGatewayResult, TripwireAnalysis, PiiDetectionResult } from "@/lib/types";
import { buildTripwireContext } from "./contextBuilder";
import { calculateRiskScore } from "./riskEngine";
import { decideTripwireAction } from "./policyEngine";
import { detectEmails, detectApiKeys } from "./detectors";

type GatewayInput = {
  runId?: string;
  scenarioId?: string;
  toolName: string;
  toolArgs: Record<string, unknown>;
  source: "user" | "system" | "browser_content" | "tool_output" | "agent";
  userTask?: string;
  previousSteps?: string[];
  rawInput?: string;
};

export function inspectToolCall(input: GatewayInput): TripwireGatewayResult {
  const context = buildTripwireContext(input);
  const risk = calculateRiskScore(context);
  const policy = decideTripwireAction(context, risk);

  const combinedInput = { ...input.toolArgs, _rawInput: input.rawInput ?? "" };
  const emails = detectEmails(combinedInput);
  const apiKeys = detectApiKeys(combinedInput);

  const piiFindings: PiiDetectionResult["findings"] = [];
  for (const email of emails) {
    piiFindings.push({
      type: "EMAIL",
      excerpt: email.replace(/(?<=.{3}).*@/, "***@"),
      field: "detected",
    });
  }
  for (const key of apiKeys) {
    piiFindings.push({
      type: "API_KEY",
      excerpt: key.length > 10 ? key.slice(0, 10) + "***" : "***",
      field: "detected",
    });
  }

  const analysis: TripwireAnalysis = {
    toolCallId: randomUUID(),
    riskClassification: {
      score: risk.score,
      level: risk.level,
      flags: context.dataClasses.map((c) => c.toUpperCase()),
    },
    piiDetection: {
      detected: piiFindings.length > 0,
      findings: piiFindings,
    },
    decision: policy.decision,
    reason: policy.reasons.join(" "),
    safeAlternative: policy.safeAlternative,
    analyzedAt: new Date().toISOString(),
  };

  return { analysis, context };
}
