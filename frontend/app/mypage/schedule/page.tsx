import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function SchedulePage() {
  return (
    <>
      <SegmentHeader
        title="가능 시간 · 매트릭스"
        subtitle="제공 티어 · 오프라인 지역 · 요일별 슬롯 편집."
      />
      <StubTabPanel
        emoji="🕐"
        title="가능 시간 · 매트릭스"
        subtitle="언제 · 어디서 · 어떤 티어로 만날 수 있는지."
        previewItems={[
          "전화 · 화상 · 만남 제공 여부",
          "오프라인 만남 가능 지역",
          "요일별 가능 시간대",
          "감정노동 상한 게이지",
        ]}
      />
    </>
  );
}
