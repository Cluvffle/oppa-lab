import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { TrainingPostForm } from "@/features/coaching/components/TrainingPostForm";

export default function TrainingPostNewPage() {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <TrainingPostForm />
    </>
  );
}
