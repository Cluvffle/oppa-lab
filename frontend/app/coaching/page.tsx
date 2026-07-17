import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";
import { PageStub } from "@/features/landing/components/PageStub";

export default function CoachingPage() {
  return (
    <>
      <Header />
      <PageStub
        emoji="✨"
        title="매력 트레이닝"
        subtitle="가짜 소개팅에서 발견한 문제, 여기서 하나씩 잡아가. 스타일·스피치·카톡·관계까지 개인 지도."
      />
      <Footer />
    </>
  );
}
