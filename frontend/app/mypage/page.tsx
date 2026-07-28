import { Suspense } from "react";
import { MypageHome } from "@/features/mypage/components/MypageHome";
import { readRoleFromSearchParams } from "@/features/mypage/lib/role";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * /mypage 진입 페이지 — 당근 스타일 그리드 홈.
 * 기존에는 첫 탭으로 redirect 했으나, 이제 진입 페이지 자체를 그리드로.
 * 세부 탭 (/mypage/threads 등) 은 그대로 유지, 이 페이지에서 진입만.
 */
export default async function MypageIndex({ searchParams }: PageProps) {
  const sp = await searchParams;
  const role = readRoleFromSearchParams(sp);
  return (
    <Suspense fallback={<div className="mypage-home" />}>
      <MypageHome role={role} />
    </Suspense>
  );
}
