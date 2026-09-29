"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function ShareLink() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setError(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(true);
    }
  }
  return (
    <button className="secondary-button" type="button" onClick={copy}>
      {copied ? <Check size={16} /> : <Link2 size={16} />}
      {error ? "复制失败" : copied ? "链接已复制" : "复制分享链接"}
    </button>
  );
}
