import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";
import { toHotPost } from "@/features/community/adapter";
import { fetchPostsSafe } from "@/shared/lib/api";

export default async function EmergencyPage() {
  // 할까말까는 커뮤니티와 같은 게시판 데이터를 쓴다(방 = 게시판).
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
