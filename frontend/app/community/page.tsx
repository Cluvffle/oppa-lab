import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";
import { toHotPost } from "@/features/community/adapter";
import { fetchPostsSafe } from "@/shared/lib/api";

export default async function CommunityPage() {
  // Cider Backend 에서 실제 게시글을 가져온다. 실패하면 빈 배열이라 mock 으로 떨어진다.
  const { items } = await fetchPostsSafe({ limit: 50 });

  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        <CommunityBoard apiPosts={items.map(toHotPost)} />
      </Suspense>
    </>
  );
}
