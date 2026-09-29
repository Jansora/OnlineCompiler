"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  LoaderCircle,
  Play,
  RotateCcw,
  Share2,
  Terminal,
} from "lucide-react";
import { languages, type Language } from "@/lib/languages";
import type { CodeRecord } from "@/lib/server/store";

const CodeEditor = dynamic(
  () => import("@/components/code-editor").then((module) => module.CodeEditor),
  { ssr: false },
);

type ApiResponse = { record?: CodeRecord; error?: string; url?: string };

export function Playground({
  language,
  initialCode,
  isAuthenticated,
}: {
  language: Language;
  initialCode: string;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const config = languages[language];
  const [code, setCode] = useState(initialCode);
  const [record, setRecord] = useState<CodeRecord | null>(null);
  const [busy, setBusy] = useState<"run" | "share" | null>(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function run() {
    if (busy || !code.trim()) return;
    setBusy("run");
    setMessage("");
    setRecord(null);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const result = (await response.json()) as ApiResponse;
      if (!response.ok || !result.record)
        throw new Error(result.error ?? "运行失败。");
      setRecord(result.record);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "运行失败。");
    } finally {
      setBusy(null);
    }
  }

  async function share() {
    if (busy || !code.trim()) return;
    setBusy("share");
    setMessage("");
    try {
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const result = (await response.json()) as ApiResponse;
      if (!response.ok || !result.url)
        throw new Error(result.error ?? "分享失败。");
      router.push(result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "分享失败。");
      setBusy(null);
    }
  }

  async function copyOutput() {
    if (!record) return;
    try {
      await navigator.clipboard.writeText(
        [record.stdout, record.stderr].filter(Boolean).join("\n"),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setMessage("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  return (
    <section className="workspace">
      <div className="workspace-header">
        <div className="workspace-intro">
          <h1>写代码。即刻看结果。</h1>
          <p>{config.description} 在浏览器中编写、运行并保存代码。</p>
        </div>
        <div className="action-bar">
          <div className="action-copy">
            <span className="action-number">WRITE & RUN</span>
            <span>代码会在服务端运行，并保存执行记录。</span>
          </div>
          <div className="action-buttons">
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setCode(config.sample);
                setRecord(null);
                setMessage("");
              }}
              disabled={!!busy}
            >
              <RotateCcw size={16} /> 重置示例
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={share}
              disabled={!!busy || !code.trim()}
            >
              {busy === "share" ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Share2 size={17} />
              )}{" "}
              分享代码
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={run}
              disabled={!!busy || !code.trim()}
            >
              {busy === "run" ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Play size={17} fill="currentColor" />
              )}{" "}
              {busy === "run" ? "运行中" : "运行代码"}
            </button>
          </div>
        </div>
      </div>

      <div className="workspace-grid">
        <section className="panel editor-panel" aria-label="代码编辑器">
          <div className="panel-topline">
            <div className="panel-heading-group">
              <span className="panel-label">编辑器</span>
              <span className="file-tab">
                <span className="file-icon">{config.short}</span> main.
                {config.extension}
              </span>
            </div>
            <span className="editor-language">{config.name}</span>
          </div>
          <div className="editor-area">
            <CodeEditor language={language} code={code} onChange={setCode} />
          </div>
          <div className="panel-footer editor-footer">
            <span>MONACO EDITOR</span>
            <span>
              UTF-8 <span className="footer-divider">·</span> {config.name}
            </span>
          </div>
        </section>

        <section className="panel result-panel" aria-label="运行结果">
          <div className="panel-topline">
            <div className="panel-heading-group">
              <span className="panel-label">运行结果</span>
              <span className="result-terminal">
                <Terminal size={16} /> 终端输出
              </span>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="复制输出"
              title="复制输出"
              onClick={copyOutput}
              disabled={!record}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="result-body" aria-live="polite">
            {busy === "run" ? (
              <div className="result-placeholder">
                <LoaderCircle className="spin" size={27} />
                <strong>正在运行…</strong>
                <span>运行有超时保护</span>
              </div>
            ) : message ? (
              <div className="result-error">{message}</div>
            ) : record ? (
              <>
                <div className={`result-status ${record.status}`}>
                  <span className="status-light" />
                  {record.status === "success"
                    ? "运行成功"
                    : record.status === "timeout"
                      ? "运行超时"
                      : record.status === "output_limit"
                        ? "输出超限"
                        : record.status === "unavailable"
                          ? "环境不可用"
                          : "运行失败"}
                  <span className="result-duration">
                    {record.duration_ms} ms
                  </span>
                </div>
                <pre>
                  {record.stdout || record.stderr ? (
                    <>
                      {record.stdout}
                      {record.stderr ? `\n${record.stderr}` : ""}
                    </>
                  ) : (
                    "程序已结束，没有输出。"
                  )}
                </pre>
              </>
            ) : (
              <div className="result-placeholder">
                <div className="prompt-symbol">›_</div>
                <strong>等待你的第一行输出</strong>
                <span>点击上方「运行代码」，结果会显示在这里。</span>
              </div>
            )}
          </div>
          <div className="panel-footer result-footer">
            <span>
              <Clock3 size={13} /> 每次运行都会保存到代码库
            </span>
            {record && isAuthenticated ? (
              <Link href={`/runs/${record.id}`}>
                查看记录 <ArrowUpRight size={13} />
              </Link>
            ) : (
              <span>准备就绪</span>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
