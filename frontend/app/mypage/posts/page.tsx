import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function MyPostsPage() {
  return (
    <>
      <SegmentHeader
        title="작성한 글"
        subtitle="커뮤니티/할까말까에 남긴 글을 한눈에."
      />
      <StubTabPanel
        emoji="📝"
        title="작성한 글"
        subtitle="아직 준비 중. 곧 여기서 내 글을 볼 수 있어."
        previewItems={[
          "커뮤니티 게시글",
          "할까말까 질문",
          "매력 트레이닝 모집 오픈",
          "댓글 남긴 글",
        ]}
      />
    </>
  );
}
