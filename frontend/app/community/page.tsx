import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";
import { PageStub } from "@/features/landing/components/PageStub";

export default function CommunityPage() {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <PageStub
        emoji="💬"
        title="라운지"
        subtitle="자유 · 어필 피드 · 성장일지 · 모범답안 · 리얼 인터뷰 · 졸업생. 위에서 가고 싶은 곳 골라봐."
      />
      <Footer />
    </>
  );
}
