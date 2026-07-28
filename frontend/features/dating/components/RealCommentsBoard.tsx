"use client";

import { useState, useMemo } from "react";
import {
  realCommentsMock,
  type MeetTier,
  type RealCommentMock,
} from "@/shared/lib/mock";
import { CiderSymbol } from "@/shared/ui/ReactionIcons";
import { cn } from "@/shared/lib/cn";

type Filter = "all" | MeetTier;

const filterButtons: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "voice", label: "전화" },
  { key: "offline", label: "만남" },
];

export function RealCommentsBoard() {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<MeetTier, number> = { voice: 0, offline: 0 };
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
    <main className="community-board">
      <div className="container">
        <header className="community-board__head">
          <h1 className="community-board__title">자 이제 소개팅 후기 들을 시간이야.</h1>
          <p className="community-board__sub">
            오빠랑 대화하니까 이런 느낌이었대.. 너무 상처 받기 없기!
          </p>
        </header>

        <div className="community-filter">
          {filterButtons.map((b) => {
            const active = filter === b.key;
            const count =
              b.key === "all" ? realCommentsMock.length : counts[b.key];
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setFilter(b.key)}
                className={cn(
                  "community-filter__pill",
                  active && "community-filter__pill--active"
                )}
              >
                {b.label}
                <span className="community-filter__count">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="community-board__empty">
            아직 이 티어의 피드백 없어.
          </div>
        ) : (
          <ul className="community-board__list">
            {filtered.map((c) => (
              <li key={c.id}>
                <FeedbackCard c={c} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function FeedbackCard({ c }: { c: RealCommentMock }) {
  const [liked, setLiked] = useState(false);
  const count = liked ? c.likes + 1 : c.likes;
  const tierLabel = c.tier === "voice" ? "전화" : "만남";

  return (
    <article className="community-post-card">
      <div className="community-post-card__meta">
        <span className="community-post-card__board">#{tierLabel}</span>
      </div>
      <h2 className="community-post-card__title">
        {c.authorName} → {c.guyNick}
      </h2>
      <p className="community-post-card__body">&ldquo;{c.text}&rdquo;</p>
      <div className="community-post-card__foot">
        <span className="community-post-card__timeMeta">
          <span>{c.createdAtRelative}</span>
        </span>
        <span className="community-post-card__stats">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            className={cn(
              "community-post-card__reaction like-btn like-btn--cider",
              liked && "like-btn--on"
            )}
            aria-pressed={liked}
            aria-label="사이다 발언"
          >
            <CiderSymbol size={16} filled={liked} />
            <span>{count}</span>
          </button>
        </span>
      </div>
    </article>
  );
}
