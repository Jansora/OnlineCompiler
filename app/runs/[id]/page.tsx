import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3, Terminal } from "lucide-react";
import { languages } from "@/lib/languages";
import { getRecord } from "@/lib/server/store";
import { ShareLink } from "@/components/share-link";
import { currentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const record = await getRecord(id);
  if (!record) notFound();
  const user = await currentUser();
  if (record.kind === "run" && !user) {
    redirect(`/auth/login?next=${encodeURIComponent(`/runs/${id}`)}`);
  }
  if (record.kind === "run" && !user?.is_admin && record.user_id !== user?.id)
    notFound();
  const language = languages[record.language];

  return (
    <section className="detail-page">
      <Link className="back-link" href="/library">
        <ArrowLeft size={16} /> 返回代码库
      </Link>
      <div className="page-heading detail-heading">
        <div>
          <div className="eyebrow">
            CODE LIBRARY <span className="eyebrow-slash">/</span>{" "}
            {record.kind === "share" ? "SHARED CODE" : "RUN RECORD"}
          </div>
          <h1>
            {record.kind === "share" ? "分享的代码" : "一次运行记录"}
            <span className="heading-suffix"> / {language.name}</span>
          </h1>
          <p>
            {new Intl.DateTimeFormat("zh-CN", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Kuala_Lumpur",
            }).format(new Date(record.created_at))}
          </p>
        </div>
        <ShareLink />
      </div>
      <div className="detail-grid">
        <section className="panel">
          <div className="panel-topline">
            <span className="panel-label">代码快照</span>
            <span className="panel-meta">main.{language.extension}</span>
          </div>
          <pre className="detail-code">
            <code>{record.code}</code>
          </pre>
        </section>
        <section className="panel">
          <div className="panel-topline">
            <span className="panel-label">
              {" "}
              {record.kind === "share" ? "分享信息" : "运行输出"}
            </span>
            <span className="panel-meta">RESULT</span>
          </div>
          <div className="detail-result">
            <div className={`result-status ${record.status}`}>
              <span className="status-light" />
              {record.status === "shared"
                ? "代码已保存"
                : record.status === "success"
                  ? "运行成功"
                  : record.status === "timeout"
                    ? "运行超时"
                    : "运行失败"}
              {record.duration_ms !== null && (
                <span className="result-duration">{record.duration_ms} ms</span>
              )}
            </div>
            {record.kind === "share" ? (
              <p>
                这是一份可直接打开的代码快照。点击下方按钮可载入编辑器继续运行。
              </p>
            ) : (
              <pre>
                <Terminal size={16} />{" "}
                {record.stdout || record.stderr
                  ? `${record.stdout}${record.stderr ? `\n${record.stderr}` : ""}`
                  : "程序已结束，没有输出。"}
              </pre>
            )}
          </div>
        </section>
      </div>
      <div className="detail-actions">
        <span>
          <Clock3 size={14} /> 记录 ID：{record.id}
        </span>
        <Link
          className="primary-button"
          href={`/${record.language}?record=${record.id}`}
        >
          在编辑器中打开 <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
