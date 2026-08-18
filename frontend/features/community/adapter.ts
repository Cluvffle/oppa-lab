import type { ApiPost } from "@/shared/lib/api";
import {
  communityBoardLabel,
  type HotPostMock,
} from "@/shared/lib/mock";

/** "3시간 전" 같은 상대 시간. Intl 없이 단순 계산으로 충분하다. */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  return `${Math.floor(hour / 24)}일 전`;
}

/**
 * 백엔드 게시글을 화면이 쓰는 형태로 변환한다.
 *
 * 아직 백엔드에 없는 값이 있다:
 * - authorNickname: 커뮤니티는 익명이라 서버가 작성자를 내려주지 않는다.
 * - viewCount: 조회수 집계가 없어 0으로 둔다.
 * - comments: 목록 API 는 댓글 본문을 주지 않는다(상세에서만).
 */
export function toHotPost(post: ApiPost): HotPostMock {
  const relative = relativeTime(post.createdAt);
  const likes =
    post.reactions.sweet_potato + post.reactions.cider + post.reactions.heart;

  return {
    id: post.id,
    board: post.board,
    boardLabel: communityBoardLabel[post.board],
    title: post.title ?? post.content.slice(0, 40),
    body: post.content,
    authorNickname: "익명 오빠",
    meta: `댓글 ${post.commentCount} · ${relative}`,
    commentCount: post.commentCount,
    likes,
    viewCount: 0,
    createdAtRelative: relative,
    comments: [],
  };
}
