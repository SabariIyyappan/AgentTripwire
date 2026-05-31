import { NextResponse } from "next/server";
import { getRun } from "@/lib/storage/memory";
import type { ApiResponse, Run } from "@/lib/types";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ runId: string }>;
}

export async function GET(
  _req: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Run>>> {
  const { runId } = await context.params;
  const run = getRun(runId);

  if (!run) {
    return NextResponse.json(
      { ok: false, error: `Run "${runId}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data: run });
}
