import { isLanguage, type Language } from "@/lib/languages";

export const MAX_CODE_BYTES = 64 * 1024;

export function parseCodeRequest(
  value: unknown,
): { language: Language; code: string } | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (!isLanguage(body.language) || typeof body.code !== "string") return null;
  if (
    !body.code.trim() ||
    Buffer.byteLength(body.code, "utf8") > MAX_CODE_BYTES
  )
    return null;
  // sqlite3's CLI also accepts .shell, .read and other dot commands. Keep the
  // SQL playground limited to SQL rather than exposing another command path.
  if (body.language === "sql" && /^\s*\./m.test(body.code)) return null;
  return { language: body.language, code: body.code };
}
