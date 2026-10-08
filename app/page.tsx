import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Github } from "lucide-react";
import { languageIds, languages } from "@/lib/languages";

export const metadata: Metadata = {
  title: "OnlineCompiler · 在线代码演练场",
  description:
    "在浏览器中编写和运行代码，查看运行结果、回顾记录并分享代码快照。",
};

const contents = [
  { id: "quick-start", title: "快速开始" },
  { id: "languages", title: "支持的语言" },
  { id: "features", title: "功能说明" },
  { id: "accounts", title: "账号与分享" },
];

export default function Home() {
  return (
    <div className="readme-page">
      <div className="readme-filebar">
        <FileText size={16} aria-hidden="true" />
        <span>README.md</span>
      </div>
      <div className="readme-layout">
        <article className="readme-document" aria-labelledby="readme-title">
          <header className="readme-intro">
            <h1 id="readme-title">OnlineCompiler</h1>
            <p className="readme-lead">一个随时可以打开的代码演练场。</p>
            <p>
              在浏览器中写一段代码，运行并查看结果。用它验证一个想法、练习一门语言，
              或把可复现的代码分享给别人。
            </p>
            <div className="readme-actions">
              <Link
                className="primary-button"
                href="/playground"
                prefetch={false}
              >
                进入演练场 <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="secondary-button"
                href="https://github.com/Jansora/OnlineCompiler"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={16} aria-hidden="true" /> 查看源码
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </header>
          <section className="readme-section" id="quick-start">
            <h2>快速开始</h2>
            <ol className="readme-steps">
              <li>进入演练场，选择你想使用的语言。</li>
              <li>修改编辑器中的示例，或写下自己的代码。</li>
              <li>点击「运行代码」，在结果面板查看输出和运行状态。</li>
            </ol>
            <div className="readme-example" aria-label="Python 代码与输出示例">
              <div className="readme-example-label">Python 示例</div>
              <pre>
                <code>{'print("Hello, playground!")'}</code>
              </pre>
              <div className="readme-example-output">
                <span>输出</span>
                <code>Hello, playground!</code>
              </div>
            </div>
            <p>
              不知道从哪里开始？
              <Link href="/python" prefetch={false}>
                打开 Python 示例 <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
              。
            </p>
          </section>
          <section className="readme-section" id="languages">
            <h2>支持的语言</h2>
            <p>
              每种语言都提供一段可运行的示例。选择语言即可打开对应的演练场。
            </p>
            <div className="readme-table-wrap">
              <table className="readme-language-table">
                <thead>
                  <tr>
                    <th scope="col">语言</th>
                    <th scope="col">你可以尝试</th>
                  </tr>
                </thead>
                <tbody>
                  {languageIds.map((id) => (
                    <tr key={id}>
                      <th scope="row">
                        <Link href={`/${id}`} prefetch={false}>
                          {languages[id].name}{" "}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                      </th>
                      <td>{languages[id].description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="readme-section" id="features">
            <h2>功能说明</h2>
            <dl className="readme-features">
              <div>
                <dt>在线编辑</dt>
                <dd>
                  使用 Monaco
                  编辑器编写代码，支持语法高亮。随时重置示例，重新开始。
                </dd>
              </div>
              <div>
                <dt>运行与输出</dt>
                <dd>
                  代码在服务端执行，结果面板展示输出、错误信息、运行状态和耗时，支持复制输出。
                </dd>
              </div>
              <div>
                <dt>回顾记录</dt>
                <dd>
                  每次运行都会保存记录。登录后，在
                  <Link href="/library">代码库</Link>
                  查看自己的代码和结果，也可以重新打开继续编辑。
                </dd>
              </div>
              <div>
                <dt>分享代码</dt>
                <dd>
                  点击「分享代码」生成当前代码的快照链接。后续编辑不会改变已经分享的内容。
                </dd>
              </div>
            </dl>
          </section>
          <section className="readme-section" id="accounts">
            <h2>账号与分享</h2>
            <p>
              无需登录即可运行代码和创建公开分享链接。注册只需要用户名和密码。
            </p>
            <ul className="readme-notes">
              <li>登录后运行的代码会归属你的账号，方便在代码库中查找。</li>
              <li>匿名运行的记录不会自动加入之后登录的账号。</li>
              <li>分享链接公开可访问，拿到链接的人可以查看代码快照。</li>
            </ul>
            <Link className="readme-account-link" href="/auth/register">
              创建账号 <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </section>
        </article>
        <aside className="readme-sidebar">
          <nav aria-label="README 目录">
            <span className="readme-toc-label">本页内容</span>
            {contents.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.title}
              </a>
            ))}
          </nav>
          <p>准备好写代码了？</p>
          <Link
            className="readme-sidebar-entry"
            href="/playground"
            prefetch={false}
          >
            打开演练场 <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
