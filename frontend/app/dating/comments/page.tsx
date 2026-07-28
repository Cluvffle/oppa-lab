import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { RealCommentsBoard } from "@/features/dating/components/RealCommentsBoard";

export default function DatingCommentsPage() {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <RealCommentsBoard />
    </>
  );
}
