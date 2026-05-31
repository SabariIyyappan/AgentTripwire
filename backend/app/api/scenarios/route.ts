import { NextResponse } from "next/server";
import { getAllScenarios } from "@/lib/scenarios";
import type { ApiResponse, Scenario } from "@/lib/types";

export const runtime = "nodejs";

export function GET(): NextResponse<ApiResponse<Scenario[]>> {
  return NextResponse.json({ ok: true, data: getAllScenarios() });
}
