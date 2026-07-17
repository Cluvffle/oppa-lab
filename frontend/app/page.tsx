import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { OnlineCreatorsSection } from "@/features/landing/components/OnlineCreatorsSection";
import { AppealFeedSection } from "@/features/landing/components/AppealFeedSection";
import { RealCommentsSection } from "@/features/landing/components/RealCommentsSection";
import { CommunitySection } from "@/features/landing/components/CommunitySection";

// 홈에서는 할까말까 섹션 숨김.
// 컴포넌트 자체(EmergencyRoomsSection)와 페이지(/emergency), 헤더 네비 링크는 유지.
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <OnlineCreatorsSection />
        <AppealFeedSection />
        <RealCommentsSection />
        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
