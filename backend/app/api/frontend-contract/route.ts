import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";
import { getFrontendContract, type FrontendContract } from "@/lib/demo/contract";

export const runtime = "nodejs";

export async function GET(
  _req: Request
): Promise<NextResponse<ApiResponse<FrontendContract>>> {
  return NextResponse.json({ ok: true, data: getFrontendContract() });
}
