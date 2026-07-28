import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function LikedPostsPage() {
  return (
    <>
      <SegmentHeader
        title="좋아요한 글"
        subtitle="공감 · 사이다 · 하트 남긴 글 모음."
      />
      <StubTabPanel
        emoji="❤️"
        title="좋아요한 글"
        subtitle="아직 준비 중. 곧 여기서 반응 남긴 글을 다시 볼 수 있어."
        previewItems={[
          "고구마 남긴 글",
          "사이다 남긴 댓글",
          "하트 남긴 자유글",
          "북마크",
        ]}
      />
    </>
  );
}
