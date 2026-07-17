"use client";

import { useState, useMemo } from "react";
import { Avatar } from "@/shared/ui/Avatar";
import {
  VoiceIcon,
  VideoIcon,
  HandshakeIcon,
  FollowerIcon,
} from "@/shared/ui/StatIcons";
import {
  realCommentsMock,
  creatorsMock,
  meetTierLabel,
  type MeetTier,
} from "@/shared/lib/mock";
import { cn } from "@/shared/lib/cn";

type Filter = "all" | MeetTier;

const filterButtons: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "voice", label: meetTierLabel.voice },
  { key: "video", label: meetTierLabel.video },
  { key: "offline", label: meetTierLabel.offline },
];

const tierIcon: Record<MeetTier, (props: { size?: number }) => React.ReactElement> = {
  voice: VoiceIcon,
  video: VideoIcon,
  offline: HandshakeIcon,
};

/** 크리에이터 id → 아바타 경로 매핑 (mock에서 조회) */
const creatorAvatarMap = Object.fromEntries(
  creatorsMock.map((c) => [c.id, c.avatar])
);

export function RealCommentsBoard() {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c = { voice: 0, video: 0, offline: 0 };
    realCommentsMock.forEach((r) => {
      c[r.tier]++;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return realCommentsMock;
    return realCommentsMock.filter((r) => r.tier === filter);
  }, [filter]);

  return (
    <div className="comments-board">
      <div className="comments-board__header">
        <div className="comments-board__intro">
          <h1 className="comments-board__title">자 이제 소개팅 후기 들을 시간이야.</h1>
          <p className="comments-board__sub">
            오빠랑 소개팅하니까 이런 느낌이었대.. 너무 뭐라한다고 상처 받기 없기!
          </p>
        </div>

        {/* 필터 pill (헤더 우측) */}
        <div className="comments-filter">
          {filterButtons.map((b) => {
            const active = filter === b.key;
            const count =
              b.key === "all" ? realCommentsMock.length : counts[b.key];
            const Icon = b.key === "all" ? null : tierIcon[b.key];
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setFilter(b.key)}
                className={cn(
                  "comments-filter__pill",
                  active && "comments-filter__pill--active"
                )}
              >
                {Icon && <Icon size={14} />}
                {b.label}
                <span className="comments-filter__count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 코멘트 카드 그리드 */}
      <div className="comments-grid">
        {filtered.map((c) => {
          const TierIcon = tierIcon[c.tier];
          return (
            <article
              key={c.id}
              className={cn("comment-tile", `comment-tile--${c.tier}`)}
            >
              <div className="comment-tile__head">
                <span className={cn("comment-tile__tier", `comment-tile__tier--${c.tier}`)}>
                  <TierIcon size={14} />
                  {meetTierLabel[c.tier]}
                </span>
                <span className="comment-tile__time">{c.createdAtRelative}</span>
              </div>

              <p className="comment-tile__text">&ldquo;{c.text}&rdquo;</p>

              <div className="comment-tile__foot">
                <div className="comment-tile__author">
                  <Avatar
                    src={creatorAvatarMap[c.authorId]}
                    size="sm"
                    alt={c.authorName}
                  />
                  <div className="comment-tile__author-info">
                    <span className="comment-tile__author-name">
                      {c.authorName}
                    </span>
                    <span className="comment-tile__author-target">
                      → {c.guyNick}
                    </span>
                  </div>
                </div>
                <div className="comment-tile__actions">
                  <span className="comment-tile__likes">
                    <FollowerIcon size={16} />
                    {c.likes}
                  </span>
                </div>
              </div>

              {c.tags && c.tags.length > 0 && (
                <div className="comment-tile__tags">
                  {c.tags.map((t) => (
                    <span key={t} className="comment-tile__tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="comments-empty">
          아직 이 티어의 코멘트 없어.
        </div>
      )}
    </div>
  );
}
