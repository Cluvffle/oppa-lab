import { redirect } from "next/navigation";
import { readRoleFromSearchParams } from "@/features/mypage/lib/role";
import { CREATOR_TABS, USER_TABS } from "@/features/mypage/lib/tabs";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** /mypage 진입 시 첫 탭으로 리다이렉트 */
export default async function MypageIndex({ searchParams }: PageProps) {
  const sp = await searchParams;
  const role = readRoleFromSearchParams(sp);
  const first = role === "creator" ? CREATOR_TABS[0].key : USER_TABS[0].key;
  const q = role === "creator" ? "?role=creator" : "";
  redirect(`/mypage/${first}${q}`);
}
