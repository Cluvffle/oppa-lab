import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";
import { toHotPost } from "@/features/community/adapter";
import { boardOfRoom } from "@/features/community/roomMapping";
import { fetchPostsSafe } from "@/shared/lib/api";

const ALLOWED = new Set(["kakao", "style", "profile"]);

interface Props {
  params: Promise<{ room: string }>;
}

export default async function EmergencyRoomPage({ params }: Props) {
  const { room } = await params;
  if (!ALLOWED.has(room)) notFound();

  const { items } = await fetchPostsSafe({
    board: boardOfRoom(room),
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
