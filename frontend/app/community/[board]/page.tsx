import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";
import { toHotPost } from "@/features/community/adapter";
import { fetchPostsSafe, type ApiBoard } from "@/shared/lib/api";

const ALLOWED = new Set(["free"]);

interface Props {
  params: Promise<{ board: string }>;
}

export default async function CommunityBoardPage({ params }: Props) {
  const { board } = await params;
  if (!ALLOWED.has(board)) notFound();

  const { items } = await fetchPostsSafe({
    board: board as ApiBoard,
    limit: 50,
  });

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
