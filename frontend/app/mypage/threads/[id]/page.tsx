import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 구 URL 호환: /mypage/threads/{id} → /mypage/threads?thread={id}
 * 새 UI 는 2-pane 워크스페이스 하나로 통합.
 */
export default async function LegacyThreadDetailRedirect({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const roleParam = sp.role;
  const role =
    (Array.isArray(roleParam) ? roleParam[0] : roleParam) === "creator"
      ? "creator"
      : "user";
  const qs = new URLSearchParams({ thread: id });
  if (role === "creator") qs.set("role", "creator");
  redirect(`/mypage/threads?${qs.toString()}`);
}
