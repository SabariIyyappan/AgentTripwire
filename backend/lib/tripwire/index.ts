export { inspectToolCall } from "./gateway";
export { buildTripwireContext } from "./contextBuilder";
export { calculateRiskScore } from "./riskEngine";
export { decideTripwireAction } from "./policyEngine";
export type { PolicyDecision } from "./policyEngine";
export {
  detectEmails,
  detectApiKeys,
  detectTokensOrSecrets,
  detectSensitiveDataClasses,
  detectDestinationDomain,
  isExternalDestination,
  isApprovedDestination,
  detectDestructiveCommand,
  detectRiskyShellPatterns,
} from "./detectors";
