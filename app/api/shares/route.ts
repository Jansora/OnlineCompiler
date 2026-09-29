import { NextResponse } from "next/server";
import { saveShare } from "@/lib/server/store";
import { MAX_CODE_BYTES, parseCodeRequest } from "@/lib/server/validation";
import { readJsonRequest, RequestTooLargeError } from "@/lib/server/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let value: unknown;
  try {
    value = await readJsonRequest(request);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestTooLargeError
            ? "请求体过大。"
            : "请求必须是 JSON。",
      },
      { status: error instanceof RequestTooLargeError ? 413 : 400 },
    );
  }
  const input = parseCodeRequest(value);
  if (!input) {
    return NextResponse.json(
      {
        error: `请选择语言并输入不超过 ${MAX_CODE_BYTES / 1024} KiB 的代码；SQL 不支持点命令。`,
      },
      { status: 400 },
    );
  }
  try {
    const record = await saveShare(input.language, input.code);
    return NextResponse.json(
      { record, url: `/runs/${record.id}` },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Share failed",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "保存分享失败，请检查数据库。" },
      { status: 500 },
    );
  }
}
