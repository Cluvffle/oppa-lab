import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function AppealPage() {
  return (
    <>
      <SegmentHeader
        title="내 어필 피드"
        subtitle="내가 올린 스타일 · 표정 · 카톡 어필이랑 받은 피드백."
      />
      <StubTabPanel
        emoji="🎬"
        title="내 어필 피드"
        subtitle="어필 게시물이랑 여사친들 코멘트."
        previewItems={[
          "내가 올린 어필 게시물",
          "여사친들한테 받은 코멘트",
          "성장 페어 (before / after) 링크",
          "저장한 인기 어필",
        ]}
      />
    </>
  );
}
