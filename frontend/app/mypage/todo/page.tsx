import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function TodoPage() {
  return (
    <>
      <SegmentHeader
        title="오늘 할 일"
        subtitle="지금 답 안 해도 되는 건 아니야. 오빠들이 기다리고 있어."
      />
      <StubTabPanel
        emoji="📅"
        title="오늘 할 일"
        subtitle="응답 대기 · 피드백 미작성 · 예약된 통화."
        previewItems={[
          "응답 대기 중인 조율 채팅",
          "피드백 미작성 회차 리스트",
          "오늘 예약된 통화 · 만남",
          "응답속도 배지 상태",
        ]}
      />
    </>
  );
}
