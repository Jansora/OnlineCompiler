import { NextResponse } from "next/server";
import { getRecord } from "@/lib/server/store";
import { currentUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: "记录不存在。" }, { status: 404 });
  }
  const user = await currentUser();
  const record = await getRecord(id);
  return record &&
    (record.kind === "share" ||
      (user && (user.is_admin || record.user_id === user.id)))
    ? NextResponse.json({ record })
    : NextResponse.json({ error: "记录不存在。" }, { status: 404 });
}
