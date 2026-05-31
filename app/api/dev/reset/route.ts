import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";
import { clearAll } from "@/lib/storage/memory";
import { clearWebhookDeliveries, resetCrmStore } from "@/lib/tools";

export const runtime = "nodejs";

interface ResetData {
  reset: true;
  cleared: {
    runs: true;
    reports: true;
    webhookDeliveries: true;
    crmStore: true;
  };
  timestamp: string;
}

export async function POST(
  _req: Request
): Promise<NextResponse<ApiResponse<ResetData>>> {
  try {
    clearAll();
    clearWebhookDeliveries();
    resetCrmStore();

    return NextResponse.json({
      ok: true,
      data: {
        reset: true,
        cleared: {
          runs: true,
          reports: true,
          webhookDeliveries: true,
          crmStore: true,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `DEMO_RESET_FAILED: ${message}` },
      { status: 500 }
    );
  }
}
