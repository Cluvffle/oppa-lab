import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function PayoutPage() {
  return (
    <>
      <SegmentHeader
        title="정산 · 포인트"
        subtitle="회차 급여와 포인트 원장, 정산 이력."
      />
      <StubTabPanel
        emoji="💰"
        title="정산 · 포인트"
        subtitle="이번 달 얼마나 벌었는지."
        previewItems={[
          "이번 달 회차 급여",
          "포인트 원장 (할까말까 답변 · 어필 피드백)",
          "정산 예정 · 정산 완료 이력",
          "세금 · 신고 안내",
        ]}
      />
    </>
  );
}
