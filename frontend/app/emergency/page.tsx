import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { CommunityBoard } from "@/features/community/CommunityBoard";

export default function EmergencyPage() {
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
