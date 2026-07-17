import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function EmergencyPage() {
  return (
    <>
      <SegmentHeader
        title="내 할까말까"
        subtitle="4대 할까말까에서 내가 올린 질문이랑 받은 답변."
      />
      <StubTabPanel
        emoji="🆘"
        title="내 할까말까"
        subtitle="4대 할까말까 활동이랑 채택 이력."
        previewItems={[
          "카톡 · 스타일 · 프사 · 관계 4방 활동",
          "채택한 답변 이력",
          "받은 도움됐어",
          "답변 오면 알림",
        ]}
      />
    </>
  );
}
