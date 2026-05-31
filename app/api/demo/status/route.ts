import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";
import { runDemoStatus, type DemoStatusResult } from "@/lib/demo/status";

export const runtime = "nodejs";

export async function GET(
  _req: Request
): Promise<NextResponse<ApiResponse<DemoStatusResult>>> {
  try {
    const result = runDemoStatus();
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: `DEMO_STATUS_FAILED: ${message}` },
      { status: 500 }
    );
  }
}
