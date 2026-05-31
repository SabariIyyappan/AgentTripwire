import { NextResponse } from "next/server";
import type { ApiSuccess, ApiError, ReplayComparison, Run, SafetyReport, HttpDelivery, TripwireAnalysis } from "@/lib/types";
import { runUnprotectedAgent } from "@/lib/agent/unprotected";
import { runProtectedAgent } from "@/lib/agent/protected";
import { compareRuns } from "@/lib/replay";

interface ReplayData {
  scenarioId: string;
  unprotected: {
    run: Run;
    report: SafetyReport;
    webhookDeliveries: HttpDelivery[];
  };
  protected: {
    run: Run;
    report: SafetyReport;
    webhookDeliveries: HttpDelivery[];
    blockedAnalyses: TripwireAnalysis[];
  };
  comparison: ReplayComparison;
}

async function handleReplay(): Promise<NextResponse<ApiSuccess<ReplayData> | ApiError>> {
  try {
    const unprotectedResult = await runUnprotectedAgent();
    const unprotectedWebhookDeliveries = [...unprotectedResult.webhookDeliveries];

    const protectedResult = await runProtectedAgent();
    const protectedWebhookDeliveries = [...protectedResult.webhookDeliveries];

    const comparison = compareRuns({
      unprotected: {
        ...unprotectedResult,
        webhookDeliveries: unprotectedWebhookDeliveries,
      },
      protected: {
        ...protectedResult,
        webhookDeliveries: protectedWebhookDeliveries,
      },
    });

    const data: ReplayData = {
      scenarioId: "prompt-injection",
      unprotected: {
        run: unprotectedResult.run,
        report: unprotectedResult.report,
        webhookDeliveries: unprotectedWebhookDeliveries,
      },
      protected: {
        run: protectedResult.run,
        report: protectedResult.report,
        webhookDeliveries: protectedWebhookDeliveries,
        blockedAnalyses: protectedResult.blockedAnalyses,
      },
      comparison,
    };

    return NextResponse.json<ApiSuccess<ReplayData>>({ ok: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json<ApiError>(
      { ok: false, error: `REPLAY_FAILED: ${message}` },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse<ApiSuccess<ReplayData> | ApiError>> {
  return handleReplay();
}

export async function GET(): Promise<NextResponse<ApiSuccess<ReplayData> | ApiError>> {
  return handleReplay();
}
