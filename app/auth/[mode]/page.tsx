import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { currentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ mode }, { next: requestedNext }] = await Promise.all([
    params,
    searchParams,
  ]);
  if (mode !== "login" && mode !== "register") notFound();
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/library";
  if (await currentUser()) redirect(next);
  const otherMode = mode === "login" ? "register" : "login";
  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">ONLINECOMPILER / ACCOUNT</span>
        <h1>{mode === "login" ? "登录账号" : "创建账号"}</h1>
        <p>
          {mode === "login"
            ? "登录后查看自己的代码运行记录。"
            : "只需用户名和密码，即可保存并查看自己的记录。"}
        </p>
        <AuthForm mode={mode} next={next} />
        <p className="auth-switch">
          {mode === "login" ? "还没有账号？" : "已有账号？"}{" "}
          <Link href={`/auth/${otherMode}?next=${encodeURIComponent(next)}`}>
            {mode === "login" ? "立即注册" : "去登录"}
          </Link>
        </p>
      </div>
    </section>
  );
}
