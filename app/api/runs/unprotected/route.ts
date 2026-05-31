import { NextResponse } from "next/server";
import { runUnprotectedAgent } from "@/lib/agent";
import type { ApiResponse } from "@/lib/types";
import type { UnprotectedRunResult } from "@/lib/agent";

export const runtime = "nodejs";

export async function POST(): Promise<
  NextResponse<ApiResponse<UnprotectedRunResult>>
> {
  try {
    const result = await runUnprotectedAgent();
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        error: `UNPROTECTED_RUN_FAILED: ${message}`,
      },
      { status: 500 }
    );
  }
}
