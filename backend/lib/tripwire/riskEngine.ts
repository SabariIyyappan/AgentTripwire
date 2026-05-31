import type { TripwireContext, RiskLevel, RiskResult } from "@/lib/types";

export function calculateRiskScore(context: TripwireContext): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  // +40 sending data to an external unapproved domain
  if (context.isExternalDestination && !context.isApprovedDestination && context.destinationDomain) {
    score += 40;
    reasons.push(`Destination domain ${context.destinationDomain} is not approved.`);
    reasons.push("Tool call would send data to an external destination.");
  }

  // +30 api_key in payload
  if (context.dataClasses.includes("api_key")) {
    score += 30;
    reasons.push("Payload contains API-key-like data.");
  }

  // +25 email or customer record
  if (context.dataClasses.includes("email") || context.dataClasses.includes("customer_record")) {
    score += 25;
    reasons.push("Payload contains email/customer data.");
  }

  // +25 untrusted source
  if (context.sourceTrust === "untrusted") {
    score += 25;
    reasons.push(`Instruction source is untrusted ${context.source.replace(/_/g, " ")}.`);
  }

  // +30 destructive command
  if (context.isDestructiveAction) {
    score += 30;
    reasons.push("Command matches destructive shell pattern.");
  }

  // +20 irreversible or external write
  const isExternalWrite =
    context.isExternalDestination &&
    (context.toolName === "http.post" ||
      context.toolName === "httpPost" ||
      context.toolName === "shell.exec" ||
      context.toolName === "shellExec");

  if (context.isDestructiveAction) {
    score += 20;
    reasons.push("Action is irreversible — destructive command detected.");
  } else if (isExternalWrite) {
    score += 20;
    reasons.push("Action writes data to an external destination.");
  }

  const capped = Math.min(score, 100);

  let level: RiskLevel;
  if (capped >= 70) level = "HIGH";
  else if (capped >= 40) level = "MEDIUM";
  else level = "LOW";

  return { score: capped, level, reasons };
}
