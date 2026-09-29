import "server-only";

import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import type { Language } from "@/lib/languages";
import type { ExecutionResult, RunStatus } from "@/lib/server/runner";
import {
  cacheRecords,
  invalidateRecords,
  readCachedRecords,
} from "@/lib/server/optional-redis";

export type CodeRecord = {
  id: string;
  kind: "run" | "share";
  language: Language;
  code: string;
  status: RunStatus | "shared" | "running";
  stdout: string;
  stderr: string;
  exit_code: number | null;
  duration_ms: number | null;
  created_at: string;
  user_id: string | null;
};

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 3000,
    });
    pool.on("error", () => console.error("PostgreSQL pool error"));
  }
  return pool;
}

async function ensureSchema() {
  schemaReady ??= getPool()
    .query(
      `CREATE TABLE IF NOT EXISTS playground_code_records (
    id UUID PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('run', 'share')),
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL,
    stdout TEXT NOT NULL DEFAULT '',
    stderr TEXT NOT NULL DEFAULT '',
    exit_code INTEGER,
    duration_ms INTEGER,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
    )
    .then(async () => {
      await getPool().query(
        "ALTER TABLE playground_code_records ADD COLUMN IF NOT EXISTS user_id UUID",
      );
      await getPool().query(
        "CREATE INDEX IF NOT EXISTS playground_code_records_created_at ON playground_code_records(created_at DESC)",
      );
      await getPool().query(
        "CREATE INDEX IF NOT EXISTS playground_code_records_user_created_at ON playground_code_records(user_id, created_at DESC)",
      );
    })
    .catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  await schemaReady;
}

export async function createRun(
  language: Language,
  code: string,
  userId: string | null,
): Promise<CodeRecord> {
  await ensureSchema();
  const id = randomUUID();
  const { rows } = await getPool().query<CodeRecord>(
    `INSERT INTO playground_code_records
    (id, kind, language, code, status, user_id) VALUES ($1, 'run', $2, $3, 'running', $4) RETURNING *`,
    [id, language, code, userId],
  );
  await invalidateRecords();
  return rows[0];
}

export async function completeRun(
  id: string,
  result: ExecutionResult,
): Promise<CodeRecord> {
  const { rows } = await getPool().query<CodeRecord>(
    `UPDATE playground_code_records
    SET status = $2, stdout = $3, stderr = $4, exit_code = $5, duration_ms = $6
    WHERE id = $1 RETURNING *`,
    [
      id,
      result.status,
      result.stdout,
      result.stderr,
      result.exitCode,
      result.durationMs,
    ],
  );
  await invalidateRecords();
  return rows[0];
}

export async function saveShare(
  language: Language,
  code: string,
  userId: string | null,
): Promise<CodeRecord> {
  await ensureSchema();
  const id = randomUUID();
  const { rows } = await getPool().query<CodeRecord>(
    `INSERT INTO playground_code_records
    (id, kind, language, code, status, user_id) VALUES ($1, 'share', $2, $3, 'shared', $4) RETURNING *`,
    [id, language, code, userId],
  );
  await invalidateRecords();
  return rows[0];
}

export async function getRecord(id: string): Promise<CodeRecord | undefined> {
  await ensureSchema();
  const { rows } = await getPool().query<CodeRecord>(
    "SELECT * FROM playground_code_records WHERE id = $1",
    [id],
  );
  return rows[0];
}

export async function listRecords(
  userId: string,
  isAdmin: boolean,
  limit = 50,
): Promise<CodeRecord[]> {
  await ensureSchema();
  if (isAdmin && limit === 50) {
    const cached = await readCachedRecords<CodeRecord[]>();
    if (cached) return cached;
  }
  const { rows } = await getPool().query<CodeRecord>(
    `SELECT * FROM playground_code_records
    WHERE ($2::boolean OR user_id = $3::uuid)
    ORDER BY created_at DESC, id DESC LIMIT $1`,
    [Math.max(1, Math.min(100, limit)), isAdmin, userId],
  );
  if (isAdmin && limit === 50) await cacheRecords(rows);
  return rows;
}
