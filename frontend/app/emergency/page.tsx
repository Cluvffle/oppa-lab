import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";
import { PageStub } from "@/features/landing/components/PageStub";

export default function EmergencyPage() {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <PageStub
        emoji="📓"
        title="오답노트"
        subtitle="이 카톡, 이 옷, 이 프사, 이 상황 — 물어보고 답 받는 곳. 어떤 방으로 갈지 위에서 골라봐."
      />
      <Footer />
    </>
  );
}
