"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import type {
  CommunityBoardKey,
  HotPostComment,
  HotPostMock,
} from "@/shared/lib/mock";
import { CiderCommentIcon } from "@/shared/ui/CiderCommentIcon";
import { SweetPotatoSymbol, CiderSymbol } from "@/shared/ui/ReactionIcons";
import { cn } from "@/shared/lib/cn";

interface Props {
  post: HotPostMock;
}

/**
 * 커뮤니티 게시글 상세.
 * 반응 규칙:
 *  - 자유 게시판: 게시글/댓글 모두 하트 (일반 좋아요)
 *  - 나머지 게시판:
 *     게시글 = 고구마 (답답 · 공감)
 *     댓글  = 사이다 (속시원 · 인정)
 */
export function PostDetail({ post }: Props) {
  const isFree = post.board === "free";
  return (
    <main className="post-detail">
      <div className="container">
        <div className="post-detail__topbar">
          <Link href="/community" className="post-detail__back" aria-label="목록으로">
            <ArrowLeft size={20} />
            <span>커뮤니티</span>
          </Link>
        </div>

        <article className="post-detail__article">
          <div className="post-detail__meta">
            <span className="post-detail__board">#{post.boardLabel}</span>
            <span className="post-detail__author">
              {post.authorNickname ?? "익명"}
            </span>
            <span className="post-detail__time">· {post.createdAtRelative}</span>
          </div>
          <h1 className="post-detail__title">{post.title}</h1>
          {post.body && <p className="post-detail__body">{post.body}</p>}

          <div className="post-detail__stats">
            <ReactionButton
              kind={isFree ? "heart" : "potato"}
              initial={post.likes}
              size={16}
            />
            <span className="post-detail__stat">
              <CiderCommentIcon size={16} />
              댓글 {post.commentCount}
            </span>
          </div>
        </article>

        <section className="post-detail__comments">
          <h2 className="post-detail__comments-title">
            댓글 {post.commentCount}개
          </h2>
          <ul className="comment-list">
            {post.comments.map((c) => (
              <CommentItem key={c.id} c={c} board={post.board} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function CommentItem({
  c,
  board,
}: {
  c: HotPostComment;
  board: CommunityBoardKey;
}) {
  const isFree = board === "free";
  const commentKind: ReactionKind = isFree ? "heart" : "cider";
  return (
    <li className="comment-item">
      <div className="comment-item__head">
        <span className="comment-item__author">{c.authorNickname}</span>
        {c.authorRelationship && (
          <span className="comment-item__relation">
            {c.authorRelationship}
          </span>
        )}
        <span className="comment-item__time">· {c.createdAtRelative}</span>
      </div>
      <p className="comment-item__body">{c.body}</p>
      <div className="comment-item__foot">
        <ReactionButton kind={commentKind} initial={c.likes} size={14} />
      </div>
      {c.replies && c.replies.length > 0 && (
        <ul className="comment-item__replies">
          {c.replies.map((r) => (
            <li key={r.id} className="comment-item comment-item--reply">
              <div className="comment-item__head">
                <span className="comment-item__reply-arrow">↳</span>
                <span className="comment-item__author">{r.authorNickname}</span>
                {r.authorRelationship && (
                  <span className="comment-item__relation">
                    {r.authorRelationship}
                  </span>
                )}
                <span className="comment-item__time">
                  · {r.createdAtRelative}
                </span>
              </div>
              <p className="comment-item__body">{r.body}</p>
              <div className="comment-item__foot">
                <ReactionButton kind={commentKind} initial={r.likes} size={14} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

type ReactionKind = "potato" | "cider" | "heart";

interface ReactionProps {
  kind: ReactionKind;
  initial: number;
  size: number;
}

const LABEL: Record<ReactionKind, string> = {
  potato: "이 글 답답해 (고구마)",
  cider: "사이다 발언 (사이다)",
  heart: "좋아요",
};

function ReactionButton({ kind, initial, size }: ReactionProps) {
  const [on, setOn] = useState(false);
  const count = on ? initial + 1 : initial;
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "like-btn",
        kind === "potato" && "like-btn--potato",
        kind === "cider" && "like-btn--cider",
        kind === "heart" && "like-btn--heart",
        on && "like-btn--on"
      )}
      aria-pressed={on}
      aria-label={LABEL[kind]}
      title={LABEL[kind]}
    >
      {kind === "heart" ? (
        <Heart size={size} fill={on ? "currentColor" : "none"} />
      ) : kind === "potato" ? (
        <SweetPotatoSymbol size={size} filled={on} />
      ) : (
        <CiderSymbol size={size} filled={on} />
      )}
      <span>{count}</span>
    </button>
  );
}
