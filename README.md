# OnlineCompiler

基于 Next.js 的在线代码演练场：Monaco 在线编辑，服务端执行 Java、Python、Go、JavaScript、Node.js、SQLite；每次运行写入 PostgreSQL，分享链接指向执行代码库中的永久快照。

## 本地运行

需要 Node.js 20.9+、PostgreSQL，以及要使用的语言对应的 `java`（JDK 17+）、`python3`、`go`、`sqlite3` 命令。JavaScript 和 Node.js 使用当前 Node.js 可执行文件。

```bash
cp .env.example .env.local
# 在 .env.local 中填写 DATABASE_URL；REDIS_URL 可不填
npm ci
npm run dev
```

打开 <http://localhost:3000>。生产构建使用 `npm run build && npm run start`。Dockerfile 已同步到 Next.js 架构；此环境不提供 Docker 运行时，因此未执行镜像构建。

## GHCR 镜像

推送到 `master` 后，GitHub Actions 会构建并发布 `ghcr.io/jansora/onlinecompiler:latest` 和对应的 `sha-<短提交号>` 标签。推送 `v*` 标签时发布同名版本标签及 SHA 标签；也可以在 Actions 页面手动运行工作流。工作流使用仓库自带的 `GITHUB_TOKEN`，无需额外配置镜像仓库凭据。

部署时为容器提供 `DATABASE_URL`，可按需提供 `REDIS_URL`；镜像本身不包含本地 `.env` 文件。

| 变量 | 用途 | 默认值 |
| --- | --- | --- |
| `DATABASE_URL` | 必填；PostgreSQL 连接串。首次访问记录时创建 `playground_code_records` 表和索引 | 无 |
| `REDIS_URL` | 可选；缓存最近 50 条代码记录 5 秒。连接失败时回退到 PostgreSQL | 无 |
| `RUN_TIMEOUT_MS` | 每次运行的总超时，限制在 1000–30000 ms | `15000` |
| `RUN_MAX_OUTPUT_BYTES` | stdout 和 stderr 总上限，限制在 1024–262144 字节 | `65536` |
| `RUNNER_UID` / `RUNNER_GID` | 可选；以指定的非特权 UID/GID 执行代码。Dockerfile 默认使用 10001 | 无 |

运行 API：`POST /api/runs`，请求体为 `{ "language": "python", "code": "print(1)" }`。记录列表：`GET /api/runs`；分享快照：`POST /api/shares`；代码库：`/library`；记录详情：`/runs/:id`。支持语言 ID：`java`、`python`、`go`、`javascript`、`node`、`sql`。接受的运行请求会先写入 `running` 记录，再执行并更新输出与状态。源码最大 64 KiB。

## 执行边界

命令由服务端白名单选择，通过 `spawn` 直接执行（不使用 shell）。每次运行使用独立临时目录；stdout/stderr 有总上限；超时或输出超限时终止进程组，结束后清理目录。SQLite 只接受 SQL，不接受 CLI 点命令（如 `.shell` 和 `.read`）。

**超时和临时目录不是安全沙箱。** 用户代码仍能访问运行账户可访问的文件与网络。公开部署前，请把执行器放到独立、受限的运行环境，隔离应用数据库和凭据，并配置网络、CPU、内存及并发限制。当前应用适合可信用户或隔离的内网环境；不要直接作为不受信任的公开代码执行服务。

## 迁移说明

旧版 CRA 前端和 Quarkus 后端已经移除。旧版 Java、Python、Go、Node 在 Quarkus 中执行；JavaScript 和 SQL 在浏览器中执行；分享内容是本地文件。本版统一从 Next.js 服务端运行和记录，旧文件分享与新 PostgreSQL 记录没有自动迁移。
