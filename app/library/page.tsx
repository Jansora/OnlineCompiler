import Link from "next/link";
import { ArrowUpRight, BookOpenText, Clock3 } from "lucide-react";
import { languages, type Language } from "@/lib/languages";
import { listRecords, type CodeRecord } from "@/lib/server/store";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

export default async function LibraryPage() {
  let records: CodeRecord[];
  let loadError = false;
  try {
    records = await listRecords();
  } catch {
    records = [];
    loadError = true;
  }

  return (
    <section className="library-page">
      <div className="page-heading library-heading">
        <div>
          <div className="eyebrow">
            YOUR WORKSPACE <span className="eyebrow-slash">/</span> LIBRARY
          </div>
          <h1>你的代码库。</h1>
          <p>运行记录与分享快照都保存在这里。</p>
        </div>
        <Link className="library-link" href="/python">
          返回演练场 <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="library-header">
        <span>
          <BookOpenText size={18} /> 执行代码库
        </span>
        <span>{records.length} 条最近记录</span>
      </div>
      {loadError ? (
        <div className="empty-state">
          <strong>无法读取代码库</strong>
          <p>请检查 DATABASE_URL 和 PostgreSQL 连接。</p>
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <strong>这里还是空的</strong>
          <p>运行一段代码，或分享当前编辑内容，记录就会出现在这里。</p>
          <Link className="primary-button" href="/python">
            开始编写 <ArrowUpRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="record-list">
          {records.map((record) => {
            const language = languages[record.language as Language];
            return (
              <Link
                className="record-row"
                key={record.id}
                href={`/runs/${record.id}`}
              >
                <span className="record-icon">{language.short}</span>
                <span className="record-main">
                  <strong>
                    {language.name}{" "}
                    <span className="record-kind">
                      {record.kind === "share" ? "分享快照" : "运行记录"}
                    </span>
                  </strong>
                  <code>
                    {record.code
                      .split("\n")
                      .find((line) => line.trim())
                      ?.trim()
                      .slice(0, 95) || "空代码"}
                  </code>
                </span>
                <span className={`record-state ${record.status}`}>
                  {record.status === "success"
                    ? "成功"
                    : record.status === "shared"
                      ? "已分享"
                      : record.status === "timeout"
                        ? "超时"
                        : record.status === "output_limit"
                          ? "超限"
                          : "失败"}
                </span>
                <span className="record-date">
                  <Clock3 size={13} /> {formatDate(record.created_at)}
                </span>
                <ArrowUpRight className="record-arrow" size={18} />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
