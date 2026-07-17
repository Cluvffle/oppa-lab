import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function BillingPage() {
  return (
    <>
      <SegmentHeader
        title="결제 · 구독"
        subtitle="결제 이력 · 남은 크레딧 · 구독 관리."
      />
      <StubTabPanel
        emoji="💳"
        title="결제 · 구독"
        subtitle="결제 · 구독 · 크레딧을 한 곳에서."
        previewItems={[
          "결제 이력",
          "남은 크레딧 · 사용 내역",
          "구독 플랜 · 다음 결제일",
          "환불 요청",
        ]}
      />
    </>
  );
}
