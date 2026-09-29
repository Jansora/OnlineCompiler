import { notFound } from "next/navigation";
import { Playground } from "@/components/playground";
import { isLanguage, languages } from "@/lib/languages";
import { getRecord } from "@/lib/server/store";

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
  const record =
    recordId && /^[0-9a-f-]{36}$/.test(recordId)
      ? await getRecord(recordId)
      : undefined;
  return (
    <Playground
      key={`${language}-${recordId ?? "new"}`}
      language={language}
      initialCode={
        record?.language === language ? record.code : languages[language].sample
      }
    />
  );
}
