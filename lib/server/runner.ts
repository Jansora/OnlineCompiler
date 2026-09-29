import "server-only";

import { spawn } from "node:child_process";
import { chown, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { languages, type Language } from "@/lib/languages";

export type RunStatus =
  | "success"
  | "error"
  | "timeout"
  | "output_limit"
  | "unavailable";

export type ExecutionResult = {
  status: RunStatus;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
};

function boundedNumber(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.max(min, Math.min(max, Math.trunc(number)))
    : fallback;
}

function commandFor(language: Language, directory: string) {
  const filename =
    language === "java" ? "Main.java" : `main.${languages[language].extension}`;
  switch (language) {
    case "java":
      return { command: "java", args: [filename], filename };
    case "python":
      return { command: "python3", args: ["-B", filename], filename };
    case "go":
      return { command: "go", args: ["run", filename], filename };
    case "javascript":
    case "node":
      return { command: process.execPath, args: [filename], filename };
    case "sql":
      return {
        command: "sqlite3",
        args: ["-batch", "-header", "-column", ":memory:"],
        filename: join(directory, filename),
      };
  }
}

function stopProcess(pid: number | undefined) {
  if (!pid) return;
  try {
    // A detached POSIX process is the leader of a new process group. Go and Java
    // may launch child processes, so kill the group instead of only the parent.
    process.kill(process.platform === "win32" ? pid : -pid, "SIGKILL");
  } catch {
    // The process may already have exited.
  }
}

export async function executeCode(
  language: Language,
  code: string,
): Promise<ExecutionResult> {
  const started = performance.now();
  const directory = await mkdtemp(join(tmpdir(), "online-compiler-"));
  const timeoutMs = boundedNumber(
    process.env.RUN_TIMEOUT_MS,
    15000,
    1000,
    30000,
  );
  const maxBytes = boundedNumber(
    process.env.RUN_MAX_OUTPUT_BYTES,
    65536,
    1024,
    262144,
  );
  const runnerUid = process.env.RUNNER_UID
    ? Number(process.env.RUNNER_UID)
    : undefined;
  const runnerGid = process.env.RUNNER_GID
    ? Number(process.env.RUNNER_GID)
    : undefined;
  if (
    (runnerUid !== undefined || runnerGid !== undefined) &&
    (!Number.isInteger(runnerUid) ||
      !Number.isInteger(runnerGid) ||
      runnerUid! < 1 ||
      runnerGid! < 1)
  ) {
    throw new Error("RUNNER_UID and RUNNER_GID must both be positive integers");
  }

  try {
    const { command, args, filename } = commandFor(language, directory);
    if (language !== "sql") {
      const file = join(directory, filename);
      await writeFile(file, code, { mode: 0o600 });
      if (runnerUid !== undefined && runnerGid !== undefined)
        await chown(file, runnerUid, runnerGid);
    }
    if (runnerUid !== undefined && runnerGid !== undefined)
      await chown(directory, runnerUid, runnerGid);

    return await new Promise<ExecutionResult>((resolve) => {
      let done = false;
      let reason: RunStatus | undefined;
      let totalBytes = 0;
      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];
      const env = {
        NODE_ENV: process.env.NODE_ENV ?? "production",
        PATH: process.env.PATH ?? "",
        HOME: directory,
        TMPDIR: directory,
        LANG: "C.UTF-8",
        PYTHONPATH: "",
        PYTHONDONTWRITEBYTECODE: "1",
        NODE_OPTIONS: "",
        GOCACHE: join(directory, ".go-cache"),
      };
      const child = spawn(/* turbopackIgnore: true */ command, args, {
        cwd: directory,
        env,
        shell: false,
        detached: process.platform !== "win32",
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
        ...(runnerUid !== undefined && runnerGid !== undefined
          ? { uid: runnerUid, gid: runnerGid }
          : {}),
      });
      const finish = (
        status: RunStatus,
        exitCode: number | null,
        errorText = "",
      ) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve({
          status,
          stdout: Buffer.concat(stdout).toString("utf8"),
          stderr: Buffer.concat(stderr).toString("utf8") + errorText,
          exitCode,
          durationMs: Math.round(performance.now() - started),
        });
      };
      const collect = (target: Buffer[], chunk: Buffer) => {
        const allowed = Math.max(0, maxBytes - totalBytes);
        if (allowed > 0) target.push(chunk.subarray(0, allowed));
        totalBytes += chunk.length;
        if (totalBytes > maxBytes && !reason) {
          reason = "output_limit";
          stopProcess(child.pid);
        }
      };
      child.stdout.on("data", (chunk: Buffer) => collect(stdout, chunk));
      child.stderr.on("data", (chunk: Buffer) => collect(stderr, chunk));
      child.once("error", (error: NodeJS.ErrnoException) => {
        finish(
          error.code === "ENOENT" ? "unavailable" : "error",
          null,
          error.code === "ENOENT"
            ? `运行环境缺少 ${command} 命令。`
            : error.message,
        );
      });
      child.once("close", (code) => {
        const status = reason ?? (code === 0 ? "success" : "error");
        finish(
          status,
          code,
          status === "timeout"
            ? `\n运行超过 ${timeoutMs / 1000} 秒，已终止。`
            : status === "output_limit"
              ? "\n输出超过限制，已终止。"
              : "",
        );
      });
      const timer = setTimeout(() => {
        reason = "timeout";
        stopProcess(child.pid);
      }, timeoutMs);
      timer.unref();

      if (language === "sql") {
        child.stdin.on("error", () => {});
        child.stdin.end(code);
      } else {
        child.stdin.end();
      }
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
