"use client";

import Editor from "@monaco-editor/react";
import type { Language } from "@/lib/languages";
import { languages } from "@/lib/languages";

export function CodeEditor({
  language,
  code,
  onChange,
}: {
  language: Language;
  code: string;
  onChange: (code: string) => void;
}) {
  return (
    <Editor
      height="100%"
      language={languages[language].monaco}
      value={code}
      onChange={(value) => onChange(value ?? "")}
      theme="vs"
      loading={<div className="editor-loading">正在加载编辑器…</div>}
      options={{
        fontFamily: "Geist Mono, 'SFMono-Regular', Consolas, monospace",
        fontSize: 14,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 20, bottom: 20 },
        tabSize: 2,
        wordWrap: "on",
      }}
    />
  );
}
