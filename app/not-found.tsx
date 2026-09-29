import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state not-found">
      <strong>没有找到这个页面</strong>
      <p>语言或记录可能不存在。</p>
      <Link className="primary-button" href="/python">
        返回演练场
      </Link>
    </div>
  );
}
