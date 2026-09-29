"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, languageIds } from "@/lib/languages";

export function LanguageDock() {
  const pathname = usePathname();

  return (
    <nav className="language-dock" aria-label="选择编程语言">
      <span className="dock-title">语言</span>
      {languageIds.map((id) => {
        const language = languages[id];
        const selected = pathname === `/${id}`;
        return (
          <Link
            key={id}
            href={`/${id}`}
            className={`dock-item${selected ? " selected" : ""}`}
            aria-current={selected ? "page" : undefined}
            title={language.name}
          >
            <span className="dock-icon">{language.short}</span>
            <span className="dock-label">{language.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
