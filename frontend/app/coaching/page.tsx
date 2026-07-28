import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { CharmTrainingBoard } from "@/features/coaching/components/CharmTrainingBoard";

export default function CoachingPage() {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <Suspense fallback={<div className="charm-training" />}>
        <CharmTrainingBoard />
      </Suspense>
    </>
  );
}
