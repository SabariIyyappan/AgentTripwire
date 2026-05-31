import type { TripwireContext, TripwireDecision, RiskResult } from "@/lib/types";

export type PolicyDecision = {
  decision: TripwireDecision;
  reasons: string[];
  safeAlternative?: string;
};

const EXFIL_SENSITIVE_CLASSES = ["api_key", "email", "customer_record", "private_note"];
const CRM_SENSITIVE_CLASSES = ["api_key", "email", "private_note"];

export function decideTripwireAction(
  context: TripwireContext,
  risk: RiskResult
): PolicyDecision {
  const isHttpPost = context.toolName === "http.post" || context.toolName === "httpPost";
  const isShellExec = context.toolName === "shell.exec" || context.toolName === "shellExec";
  const isBrowserRead =
    context.toolName === "browser.open" ||
    context.toolName === "browserOpen" ||
    context.toolName === "browser.extractText" ||
    context.toolName === "browserExtractText";
  const isCrmUpdate =
    context.toolName === "crm.updateCustomer" || context.toolName === "crmUpdateCustomer";

  const hasSensitiveExfilData = EXFIL_SENSITIVE_CLASSES.some((c) =>
    context.dataClasses.includes(c)
  );
  const hasSensitiveCrmData = CRM_SENSITIVE_CLASSES.some((c) => context.dataClasses.includes(c));

  // Override: http.post to unapproved external domain with sensitive data => block
  if (isHttpPost && context.isExternalDestination && !context.isApprovedDestination && hasSensitiveExfilData) {
    return {
      decision: "BLOCK",
      reasons: [
        "HTTP POST to unapproved external domain with sensitive data is not permitted.",
        ...risk.reasons,
      ],
      safeAlternative:
        "Do not send sensitive data to the external endpoint. Summarize the public vendor page and update CRM only with non-sensitive public information.",
    };
  }

  // Override: shell.exec with destructive command => block
  if (isShellExec && context.isDestructiveAction) {
    return {
      decision: "BLOCK",
      reasons: ["Destructive shell command is not permitted.", ...risk.reasons],
      safeAlternative:
        "Do not execute the destructive shell command. Record the attempted command in the safety report instead.",
    };
  }

  // Override: read-only browser action with low risk => allow
  if (isBrowserRead && risk.score < 40) {
    return { decision: "ALLOW", reasons: ["Read-only browser action with low risk."] };
  }

  // Override: CRM update with only non-sensitive data from trusted source => allow
  if (isCrmUpdate && !hasSensitiveCrmData && context.sourceTrust === "trusted") {
    return {
      decision: "ALLOW",
      reasons: ["CRM update contains only non-sensitive data from a trusted source."],
    };
  }

  // Score-based fallback
  if (risk.score >= 70) {
    return { decision: "BLOCK", reasons: risk.reasons };
  }
  if (risk.score >= 40) {
    return { decision: "ASK_HUMAN", reasons: risk.reasons };
  }
  return {
    decision: "ALLOW",
    reasons: risk.reasons.length > 0 ? risk.reasons : ["Risk score is within acceptable bounds."],
  };
}
