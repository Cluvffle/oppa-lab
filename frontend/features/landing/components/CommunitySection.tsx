"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  communityBoardLabel,
  hotPostsMock,
  type CommunityBoardKey,
} from "@/shared/lib/mock";
import { CommunityIcon } from "@/shared/ui/SectionIcons";
import { cn } from "@/shared/lib/cn";

type Filter = "all" | CommunityBoardKey;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "contact", label: communityBoardLabel.contact },
  { key: "style", label: communityBoardLabel.style },
  { key: "profile", label: communityBoardLabel.profile },
  { key: "free", label: communityBoardLabel.free },
];

/**
 * 홈 실시간 커뮤니티 프리뷰.
 * 4개 게시판(연락/스타일/프사/자유) pill 필터 + 필터별 최신 게시글 리스트.
 */
export function CommunitySection() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return hotPostsMock.slice(0, 6);
    return hotPostsMock.filter((p) => p.board === filter).slice(0, 6);
  }, [filter]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <CommunityIcon size={28} />
              실시간 커뮤니티
            </h2>
            <p className="section-subtitle">
              지금 활발히 대화 중인 게시글들
            </p>
          </div>
          <Link href="/community" className="section-link">
            커뮤니티 전체 →
          </Link>
        </div>

        <div className="community-filter">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "community-filter__pill",
                  active && "community-filter__pill--active"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="post-list">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/community/post/${p.id}`}
              className="post-item"
            >
              <span className="post-item__board">#{p.boardLabel}</span>
              <span className="post-item__title">{p.title}</span>
              <span className="post-item__meta">{p.meta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
