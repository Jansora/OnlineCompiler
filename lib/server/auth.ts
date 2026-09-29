import "server-only";

import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { Pool } from "pg";

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = "onlinecompiler_session";
const DEFAULT_SESSION_DAYS = 365;

export type User = { id: string; username: string; is_admin: boolean };
type StoredUser = User & { password_hash: string };

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function db() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 3000,
    });
    pool.on("error", () => console.error("PostgreSQL auth pool error"));
  }
  return pool;
}

async function ensureSchema() {
  schemaReady ??= (async () => {
    await db().query(`CREATE TABLE IF NOT EXISTS playground_users (
      id UUID PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    await db().query(`CREATE TABLE IF NOT EXISTS playground_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES playground_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    await db().query(
      "CREATE INDEX IF NOT EXISTS playground_sessions_user_id ON playground_sessions(user_id)",
    );
    await db().query(
      "CREATE INDEX IF NOT EXISTS playground_sessions_expires_at ON playground_sessions(expires_at)",
    );
  })().catch((error) => {
    schemaReady = undefined;
    throw error;
  });
  await schemaReady;
}

function sessionMaxAgeSeconds() {
  const days = Number(process.env.SESSION_MAX_AGE_DAYS ?? DEFAULT_SESSION_DAYS);
  if (!Number.isInteger(days) || days < 1 || days > 3650) {
    throw new Error(
      "SESSION_MAX_AGE_DAYS must be an integer between 1 and 3650",
    );
  }
  return Math.floor(days * 86400);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex || !/^[a-f0-9]{128}$/.test(hex)) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(derived, Buffer.from(hex, "hex"));
}

export function validUsername(value: unknown): value is string {
  return typeof value === "string" && /^[\p{L}\p{N}_-]{2,32}$/u.test(value);
}

export function validPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 256;
}

export async function initializeAdmin() {
  const username = process.env.SUPER_ADMIN_USERNAME;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!username && !password) return;
  if (!validUsername(username) || !validPassword(password)) {
    throw new Error("SUPER_ADMIN_USERNAME or SUPER_ADMIN_PASSWORD is invalid");
  }
  await ensureSchema();
  const { rows } = await db().query<User>(
    "SELECT id, username, is_admin FROM playground_users WHERE username = $1",
    [username],
  );
  if (rows[0]) {
    if (!rows[0].is_admin)
      throw new Error("Super admin username is already registered");
    return;
  }
  const passwordHash = await hashPassword(password);
  await db().query(
    `INSERT INTO playground_users (id, username, password_hash, is_admin)
     VALUES ($1, $2, $3, true) ON CONFLICT (username) DO NOTHING`,
    [randomUUID(), username, passwordHash],
  );
  const check = await db().query<User>(
    "SELECT is_admin FROM playground_users WHERE username = $1",
    [username],
  );
  if (!check.rows[0]?.is_admin)
    throw new Error("Super admin username is already registered");
}

export async function registerUser(
  username: string,
  password: string,
): Promise<User | null> {
  await ensureSchema();
  if (username === process.env.SUPER_ADMIN_USERNAME) return null;
  const passwordHash = await hashPassword(password);
  const { rows } = await db().query<User>(
    `INSERT INTO playground_users (id, username, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING RETURNING id, username, is_admin`,
    [randomUUID(), username, passwordHash],
  );
  return rows[0] ?? null;
}

export async function authenticateUser(
  username: string,
  password: string,
): Promise<User | null> {
  await ensureSchema();
  const { rows } = await db().query<StoredUser>(
    "SELECT id, username, password_hash, is_admin FROM playground_users WHERE username = $1",
    [username],
  );
  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash)))
    return null;
  return { id: user.id, username: user.username, is_admin: user.is_admin };
}

export async function startSession(user: User) {
  await ensureSchema();
  const token = randomBytes(32).toString("base64url");
  const maxAge = sessionMaxAgeSeconds();
  await db().query(
    "INSERT INTO playground_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [hashToken(token), user.id, new Date(Date.now() + maxAge * 1000)],
  );
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  await ensureSchema();
  const { rows } = await db().query<User>(
    `SELECT u.id, u.username, u.is_admin FROM playground_sessions s
     JOIN playground_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export async function endSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await ensureSchema();
    await db().query("DELETE FROM playground_sessions WHERE token_hash = $1", [
      hashToken(token),
    ]);
  }
  cookieStore.delete(COOKIE_NAME);
}
