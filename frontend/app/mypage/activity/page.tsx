import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function ActivityPage() {
  return (
    <>
      <SegmentHeader
        title="내 활동"
        subtitle="할까말까 답변 · 어필 피드 코멘트 · 받은 도움됐어."
      />
      <StubTabPanel
        emoji="💌"
        title="내 활동"
        subtitle="커뮤니티랑 코칭에서 남긴 흔적들."
        previewItems={[
          "내가 남긴 할까말까 답변",
          "어필 피드에 남긴 피드백 코멘트",
          "받은 '도움됐어' 총합",
          "커뮤니티 게시글 · 댓글",
        ]}
      />
    </>
  );
}
