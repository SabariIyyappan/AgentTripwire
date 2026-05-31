import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";

export const runtime = "nodejs";

interface HealthPayload {
  status: "ok";
  version: string;
  timestamp: string;
}

export function GET(): NextResponse<ApiResponse<HealthPayload>> {
  return NextResponse.json({
    ok: true,
    data: {
      status: "ok",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    },
  });
}
