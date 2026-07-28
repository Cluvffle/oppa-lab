import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/shared/layout/Header";
import { TrainingPostDetail } from "@/features/coaching/components/TrainingPostDetail";
import { trainingPostsMock } from "@/shared/lib/mock";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrainingPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = trainingPostsMock.find((p) => p.id === id);
  if (!post) return notFound();

  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <TrainingPostDetail post={post} />
    </>
  );
}
