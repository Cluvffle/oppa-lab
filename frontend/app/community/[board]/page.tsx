import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";

const ALLOWED = new Set(["free"]);

interface Props {
  params: Promise<{ board: string }>;
}

export default async function CommunityBoardPage({ params }: Props) {
  const { board } = await params;
  if (!ALLOWED.has(board)) notFound();
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
