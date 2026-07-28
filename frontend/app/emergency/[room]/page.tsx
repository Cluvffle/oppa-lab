import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";

const ALLOWED = new Set(["kakao", "style", "profile"]);

interface Props {
  params: Promise<{ room: string }>;
}

export default async function EmergencyRoomPage({ params }: Props) {
  const { room } = await params;
  if (!ALLOWED.has(room)) notFound();
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        <CommunityBoard />
      </Suspense>
    </>
  );
}
