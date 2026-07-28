import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function GrowthPage() {
  return (
    <>
      <SegmentHeader
        title="성장 대시보드"
        subtitle="내가 얼마나 자라고 있는지, 나만 볼 수 있는 기록."
      />
      <StubTabPanel
        emoji="📈"
        title="성장 대시보드"
        subtitle="5개 지표 시계열, 배지, 다음 스테이지 진급 조건."
        previewItems={[
          "5개 지표 시계열 (첫인상 · 대화 · 매너 · 자신감 · 외모)",
          "획득한 배지 갤러리",
          "다음 스테이지 진급 조건",
          "지금까지 만난 사이다 친구 · 회차 총합",
        ]}
      />
    </>
  );
}
