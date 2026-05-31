export interface EndpointEntry {
  method: string;
  path: string;
  purpose: string;
}

export interface FrontendContract {
  version: string;
  apiEnvelope: {
    success: string;
    error: string;
  };
  primaryDemoEndpoint: {
    method: string;
    path: string;
    description: string;
  };
  endpoints: EndpointEntry[];
  recommendedUiPanels: string[];
}

export function getFrontendContract(): FrontendContract {
  return {
    version: "phase-7",
    apiEnvelope: {
      success: "{ ok: true, data: ... }",
      error: "{ ok: false, error: string }",
    },
    primaryDemoEndpoint: {
      method: "POST",
      path: "/api/replay",
      description:
        "Runs unprotected and protected scenarios and returns comparison",
    },
    endpoints: [
      { method: "GET", path: "/api/health", purpose: "Service health" },
      { method: "GET", path: "/api/scenarios", purpose: "List attack scenarios" },
      { method: "POST", path: "/api/runs/unprotected", purpose: "Run vulnerable agent" },
      { method: "POST", path: "/api/runs/protected", purpose: "Run protected agent" },
      { method: "POST", path: "/api/replay", purpose: "Run before/after comparison" },
      { method: "GET", path: "/api/runs/:id", purpose: "Fetch stored run" },
      { method: "GET", path: "/api/reports/:id", purpose: "Fetch stored safety report" },
      {
        method: "GET",
        path: "/api/reports/:id/export?format=markdown",
        purpose: "Export safety report as markdown",
      },
      {
        method: "GET",
        path: "/api/reports/:id/export?format=json",
        purpose: "Export safety report as JSON",
      },
      { method: "POST", path: "/api/dev/reset", purpose: "Reset demo state" },
      { method: "GET", path: "/api/demo/status", purpose: "Check demo readiness" },
      {
        method: "GET",
        path: "/api/frontend-contract",
        purpose: "Machine-readable API contract for frontend",
      },
    ],
    recommendedUiPanels: [
      "Scenario overview",
      "Unprotected trace",
      "Protected trace",
      "Tripwire blocked actions",
      "Webhook delivery proof",
      "Replay comparison timeline",
      "Safety report",
    ],
  };
}
