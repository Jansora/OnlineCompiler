import { NextResponse } from "next/server";
import { readJsonRequest } from "@/lib/server/request";
import {
  authenticateUser,
  endSession,
  initializeAdmin,
  registerUser,
  startSession,
  validPassword,
  validUsername,
} from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (action === "logout") {
    await endSession();
    return NextResponse.redirect(new URL("/python", request.url), 303);
  }
  if (action !== "login" && action !== "register") {
    return NextResponse.json({ error: "操作不存在。" }, { status: 404 });
  }
  let input: unknown;
  try {
    input = await readJsonRequest(request, 4096);
  } catch {
    return NextResponse.json({ error: "请求格式无效。" }, { status: 400 });
  }
  if (!input || typeof input !== "object") {
    return NextResponse.json(
      { error: "请输入用户名和密码。" },
      { status: 400 },
    );
  }
  const { username, password } = input as Record<string, unknown>;
  if (!validUsername(username) || !validPassword(password)) {
    return NextResponse.json(
      {
        error:
          "用户名需为 2–32 位字母、数字、下划线或连字符；密码需为 8–256 位。",
      },
      { status: 400 },
    );
  }
  try {
    await initializeAdmin();
    const user =
      action === "register"
        ? await registerUser(username, password)
        : await authenticateUser(username, password);
    if (!user) {
      return NextResponse.json(
        {
          error:
            action === "register" ? "用户名已被使用。" : "用户名或密码错误。",
        },
        { status: action === "register" ? 409 : 401 },
      );
    }
    await startSession(user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error(
      "Authentication failed",
      error instanceof Error ? error.name : "unknown",
    );
    return NextResponse.json(
      { error: "认证服务暂时不可用。" },
      { status: 500 },
    );
  }
}
