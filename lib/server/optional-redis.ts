import "server-only";

import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;
let clientPromise: Promise<RedisClient | undefined> | undefined;

async function getClient() {
  if (!process.env.REDIS_URL) return undefined;
  clientPromise ??= (async () => {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: { connectTimeout: 800, reconnectStrategy: false },
    });
    client.on("error", () => {});
    try {
      await client.connect();
      return client;
    } catch {
      client.destroy();
      return undefined;
    }
  })();
  return clientPromise;
}

const KEY = "onlinecompiler:recent-records:v1";

export async function readCachedRecords<T>(): Promise<T | undefined> {
  try {
    const client = await getClient();
    const value = await client?.get(KEY);
    return value ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
}

export async function cacheRecords(value: unknown) {
  try {
    const client = await getClient();
    await client?.set(KEY, JSON.stringify(value), { EX: 5 });
  } catch {
    // PostgreSQL remains authoritative when optional Redis is unavailable.
  }
}

export async function invalidateRecords() {
  try {
    const client = await getClient();
    await client?.del(KEY);
  } catch {
    // The short TTL still bounds stale data if invalidation fails.
  }
}
