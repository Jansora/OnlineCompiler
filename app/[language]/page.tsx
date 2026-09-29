import { notFound } from "next/navigation";
import { Playground } from "@/components/playground";
import { isLanguage, languages } from "@/lib/languages";
import { getRecord } from "@/lib/server/store";
import { currentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function LanguagePage({
  params,
  searchParams,
}: {
  params: Promise<{ language: string }>;
  searchParams: Promise<{ record?: string }>;
}) {
  const [{ language }, { record: recordId }] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isLanguage(language)) notFound();
  const [user, record] = await Promise.all([
    currentUser(),
    recordId && /^[0-9a-f-]{36}$/.test(recordId)
      ? await getRecord(recordId)
      : undefined,
  ]);
  const accessibleRecord =
    record?.kind === "share" ||
    (user && (user.is_admin || record?.user_id === user.id))
      ? record
      : undefined;
  return (
    <Playground
      key={`${language}-${recordId ?? "new"}`}
      language={language}
      isAuthenticated={!!user}
      initialCode={
        accessibleRecord?.language === language
          ? accessibleRecord.code
          : languages[language].sample
      }
    />
  );
}
