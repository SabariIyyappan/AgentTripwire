import { NextResponse } from "next/server";
import { runProtectedAgent } from "@/lib/agent";
import type { ApiResponse } from "@/lib/types";
import type { ProtectedRunResult } from "@/lib/agent";

export const runtime = "nodejs";

export async function POST(): Promise<
  NextResponse<ApiResponse<ProtectedRunResult>>
> {
  try {
    const result = await runProtectedAgent();
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `PROTECTED_RUN_FAILED: ${message}` },
      { status: 500 }
    );
  }
}
