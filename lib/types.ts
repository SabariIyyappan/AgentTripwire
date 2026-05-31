// ─── Scenarios ────────────────────────────────────────────────────────────────

export type ScenarioId =
  | "prompt-injection"
  | "data-exfiltration"
  | "destructive-command";

export interface Scenario {
  id: ScenarioId;
  name: string;
  description: string;
  /** Short human-readable category label */
  category: "Prompt Injection" | "Data Exfiltration" | "Destructive Command";
  /** Tool types exercised by this scenario */
  toolsInvolved: ToolType[];
  /** Expected risk level when unprotected */
  expectedRisk: RiskLevel;
}

// ─── Tool Calls ───────────────────────────────────────────────────────────────

export type ToolType =
  | "browser"
  | "http"
  | "shell"
  | "database"
  | "email"
  | "signing"
  | "filesystem";

export interface ToolCallProposal {
  id: string;
  toolType: ToolType;
  toolName: string;
  /** Raw arguments the agent passed */
  args: Record<string, unknown>;
  /** ISO timestamp when the agent proposed this call */
  proposedAt: string;
}

// ─── Tripwire Analysis ────────────────────────────────────────────────────────

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TripwireDecision = "ALLOW" | "BLOCK" | "ASK_HUMAN" | "REWRITE";

export interface RiskClassification {
  score: number; // 0–100
  level: RiskLevel;
  flags: string[]; // e.g. ["PII_DETECTED", "EXTERNAL_EXFILTRATION"]
}

export interface PiiDetectionResult {
  detected: boolean;
  findings: Array<{
    type: "API_KEY" | "EMAIL" | "PHONE" | "CREDIT_CARD" | "CUSTOM";
    excerpt: string; // redacted excerpt for display
    field: string; // which arg field contained it
  }>;
}

export interface TripwireAnalysis {
  toolCallId: string;
  riskClassification: RiskClassification;
  piiDetection: PiiDetectionResult;
  decision: TripwireDecision;
  reason: string;
  safeAlternative?: string;
  analyzedAt: string;
}

// ─── Run / Session ────────────────────────────────────────────────────────────

export type RunMode = "unprotected" | "protected";

export type RunStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "blocked";

export interface TraceStep {
  stepIndex: number;
  description: string;
  timestamp: string;
  toolCall?: ToolCallProposal;
  analysis?: TripwireAnalysis;
  /** Outcome at this step */
  outcome: "success" | "blocked" | "rewritten" | "pending";
}

export interface Run {
  id: string;
  scenarioId: ScenarioId;
  mode: RunMode;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  /** Live trace of agent steps */
  trace: TraceStep[];
  /** Id of the final report, set when status = "completed" */
  reportId?: string;
}

// ─── Safety Report ────────────────────────────────────────────────────────────

export interface AttackSummary {
  attackType: string;
  riskLevel: RiskLevel;
  action: TripwireDecision;
  dataAtRisk: string[];
  decisionReason: string;
}

export interface ReplayComparison {
  unprotectedRunId: string;
  protectedRunId: string;
  unprotectedOutcome: string;
  protectedOutcome: string;
  stepsBlocked: number;
  dataLeaked: boolean;
  dataProtected: boolean;
}

export interface SafetyReport {
  id: string;
  runId: string;
  scenarioId: ScenarioId;
  mode: RunMode;
  generatedAt: string;
  attackSummary: AttackSummary;
  toolCallsTotal: number;
  toolCallsBlocked: number;
  toolCallsAllowed: number;
  piiFindings: PiiDetectionResult["findings"];
  replay?: ReplayComparison;
  /** Markdown or plain-text narrative */
  narrative: string;
}

// ─── Tool Results ─────────────────────────────────────────────────────────────

export interface BrowserOpenResult {
  url: string;
  title: string;
  openedAt: string;
}

export interface BrowserExtractResult {
  url: string;
  title: string;
  visibleText: string;
  hiddenText: string;
  fullText: string;
  extractedAt: string;
}

export interface CrmCustomer {
  id: string;
  name: string;
  email: string;
  company: string;
  notes: string;
  apiKey: string;
  [key: string]: unknown;
}

export interface HttpDelivery {
  id: string;
  url: string;
  body: unknown;
  deliveredAt: string;
  simulated: true;
}

export interface ShellResult {
  command: string;
  simulated: true;
  dangerous: boolean;
  stdout: string;
  stderr?: string;
  exitCode: number;
  executedAt: string;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
