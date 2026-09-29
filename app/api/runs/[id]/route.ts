import { NextResponse } from "next/server";
import { getRecord } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = await getRecord(id);
  return record
    ? NextResponse.json({ record })
    : NextResponse.json({ error: "记录不存在。" }, { status: 404 });
}
