import { NextResponse } from "next/server";
import { getReport } from "@/lib/storage/memory";
import type { ApiResponse, SafetyReport } from "@/lib/types";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ reportId: string }>;
}

export async function GET(
  _req: Request,
  context: RouteContext
): Promise<NextResponse<ApiResponse<SafetyReport>>> {
  const { reportId } = await context.params;
  const report = getReport(reportId);

  if (!report) {
    return NextResponse.json(
      { ok: false, error: `Report "${reportId}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data: report });
}
