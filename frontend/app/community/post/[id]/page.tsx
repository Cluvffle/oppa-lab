import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/shared/layout/Header";
import { PostDetail } from "@/features/community/PostDetail";
import { hotPostsMock } from "@/shared/lib/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CommunityPostPage({ params }: Props) {
  const { id } = await params;
  const post = hotPostsMock.find((p) => p.id === id);
  if (!post) notFound();
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <PostDetail post={post} />
    </>
  );
}
