// Typed API client for the AgentTripwire Next.js backend.
// All requests go to /api/* — the Vite dev server proxies them to localhost:3000.
// In production, set VITE_BACKEND_URL so the proxy target is correct.

// ─── Backend payload shapes ───────────────────────────────────────────────────

export interface BackendTraceStep {
  stepIndex: number;
  description: string;
  timestamp: string;
  toolCall?: {
    id: string;
    toolType: string;
    toolName: string;
    args: Record<string, unknown>;
    proposedAt: string;
  };
  analysis?: BackendTripwireAnalysis;
  outcome: "success" | "blocked" | "rewritten" | "pending";
}

export interface BackendTripwireAnalysis {
  toolCallId: string;
  riskClassification: {
    score: number;
    level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    flags: string[];
  };
  piiDetection: {
    detected: boolean;
    findings: Array<{
      type: "API_KEY" | "EMAIL" | "PHONE" | "CREDIT_CARD" | "CUSTOM";
      excerpt: string;
      field: string;
    }>;
  };
  decision: "ALLOW" | "BLOCK" | "ASK_HUMAN" | "REWRITE";
  reason: string;
  safeAlternative?: string;
  analyzedAt: string;
}

export interface BackendRun {
  id: string;
  scenarioId: string;
  mode: "unprotected" | "protected";
  status: string;
  startedAt: string;
  completedAt?: string;
  trace: BackendTraceStep[];
  reportId?: string;
}

export interface BackendSafetyReport {
  id: string;
  runId: string;
  scenarioId: string;
  mode: "unprotected" | "protected";
  generatedAt: string;
  attackSummary: {
    attackType: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    action: "ALLOW" | "BLOCK" | "ASK_HUMAN" | "REWRITE";
    dataAtRisk: string[];
    decisionReason: string;
  };
  toolCallsTotal: number;
  toolCallsBlocked: number;
  toolCallsAllowed: number;
  piiFindings: Array<{
    type: "API_KEY" | "EMAIL" | "PHONE" | "CREDIT_CARD" | "CUSTOM";
    excerpt: string;
    field: string;
  }>;
  narrative: string;
}

export interface BackendHttpDelivery {
  id: string;
  url: string;
  body: unknown;
  deliveredAt: string;
  simulated: true;
}

export interface UnprotectedRunResult {
  run: BackendRun;
  report: BackendSafetyReport;
  webhookDeliveries: BackendHttpDelivery[];
}

export interface ProtectedRunResult {
  run: BackendRun;
  report: BackendSafetyReport;
  webhookDeliveries: BackendHttpDelivery[];
  blockedAnalyses: BackendTripwireAnalysis[];
}

export interface BackendReplayTimeline {
  label: string;
  unprotected: string;
  protected: string;
  outcome: "unsafe" | "safe" | "blocked" | "info";
}

export interface ReplayResult {
  scenarioId: string;
  unprotected: UnprotectedRunResult;
  protected: ProtectedRunResult;
  comparison: {
    verdict: string;
    unprotectedLeaked: boolean;
    protectedLeaked: boolean;
    leakPrevented: boolean;
    unprotectedWebhookDeliveries: number;
    protectedWebhookDeliveries: number;
    blockedActions: number;
    protectedBlockedHttpExfiltration: boolean;
    protectedBlockedShellCommand: boolean;
    keyProofs: string[];
    timeline: BackendReplayTimeline[];
  };
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function apiCall<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = (await res.json()) as { ok: boolean; data?: T; error?: string };
  if (!json.ok) throw new Error(json.error ?? `API error ${res.status}`);
  return json.data as T;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  runUnprotected: () =>
    apiCall<UnprotectedRunResult>("/api/runs/unprotected", { method: "POST" }),

  runReplay: () =>
    apiCall<ReplayResult>("/api/replay", { method: "POST" }),

  getReport: (id: string) =>
    apiCall<BackendSafetyReport>(`/api/reports/${id}`),

  exportReport: (id: string, format: "json" | "markdown") =>
    apiCall<{ format: string; markdown?: string; report?: BackendSafetyReport }>(
      `/api/reports/${id}/export?format=${format}`
    ),

  resetDemo: () =>
    apiCall<{ reset: true; cleared: Record<string, true>; timestamp: string }>(
      "/api/dev/reset",
      { method: "POST" }
    ),

  demoStatus: () =>
    apiCall<{
      service: string;
      ready: boolean;
      checks: Array<{ name: string; status: string; detail: string }>;
      timestamp: string;
    }>("/api/demo/status"),
};
