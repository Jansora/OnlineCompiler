import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, Github } from "lucide-react";
import { LanguageDock } from "@/components/language-dock";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnlineCompiler · 代码演练场",
  description: "写一段代码，立即运行，保存每一次实验。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <Link
              className="brand"
              href="/python"
              aria-label="OnlineCompiler 首页"
            >
              <svg
                className="brand-mark"
                viewBox="0 0 28 26"
                aria-hidden="true"
              >
                <path d="M14 1 27 25H1L14 1Z" fill="currentColor" />
              </svg>
              <span>OnlineCompiler</span>
            </Link>
            <LanguageDock />
            <nav className="topnav" aria-label="主导航">
              <Link href="/python">演练场</Link>
              <Link href="/library">
                <BookOpenText size={16} /> 代码库
              </Link>
              <a
                href="https://github.com/Jansora/OnlineCompiler"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub 仓库"
              >
                <Github size={17} />
              </a>
            </nav>
          </header>
          <main className="main-content">{children}</main>
          <footer className="site-footer">
            <span>OnlineCompiler</span>
            <span>写代码。运行。保存。</span>
            <a
              href="https://github.com/Jansora/OnlineCompiler"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
