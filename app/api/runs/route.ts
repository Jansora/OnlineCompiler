import { NextResponse } from "next/server";
import { executeCode, type ExecutionResult } from "@/lib/server/runner";
import { completeRun, createRun, listRecords } from "@/lib/server/store";
import { MAX_CODE_BYTES, parseCodeRequest } from "@/lib/server/validation";
import { readJsonRequest, RequestTooLargeError } from "@/lib/server/request";
import { currentUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "请先登录。" }, { status: 401 });
    return NextResponse.json({
      records: await listRecords(user.id, user.is_admin),
    });
  } catch (error) {
    console.error(
      "Listing records failed",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "读取代码库失败，请检查数据库。" },
      { status: 500 },
    );
  }
}

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
    const user = await currentUser();
    const pending = await createRun(
      input.language,
      input.code,
      user?.id ?? null,
    );
    let result: ExecutionResult;
    try {
      result = await executeCode(input.language, input.code);
    } catch (error) {
      console.error(
        "Executor failed",
        error instanceof Error ? error.name : "unknown",
      );
      result = {
        status: "error",
        stdout: "",
        stderr: "执行器异常，请检查服务端运行环境。",
        exitCode: null,
        durationMs: 0,
      };
    }
    const record = await completeRun(pending.id, result);
    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error(
      "Run failed",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "运行或保存记录失败，请检查服务端配置。" },
      { status: 500 },
    );
  }
}
