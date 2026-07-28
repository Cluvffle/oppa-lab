"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  hotPostsMock,
  type CommunityBoardKey,
} from "@/shared/lib/mock";
import { CiderCommentIcon } from "@/shared/ui/CiderCommentIcon";
import { SweetPotatoSymbol } from "@/shared/ui/ReactionIcons";
import { Heart } from "lucide-react";

type Filter = "all" | CommunityBoardKey;

interface BoardMeta {
  title: string;
  subtitle: string;
}

const BOARD_META: Record<Filter, BoardMeta> = {
  all: {
    title: "커뮤니티",
    subtitle: "이 카톡, 이 옷, 이 프사 — 오빠들 다 같이 물어보고 답 받는 곳.",
  },
  contact: {
    title: "연락",
    subtitle: "카톡·전화·답장 — 뭐라 보내야 될지 모를 때 여기에 던져봐.",
  },
  style: {
    title: "스타일",
    subtitle: "오늘 코디 · 이번 시즌 옷 · 헤어 — 여자 눈으로 봤을 때 어때?",
  },
  profile: {
    title: "프사",
    subtitle: "카톡 프사 · 소개팅 앱 프사 — 첫인상 진단 받는 곳.",
  },
  free: {
    title: "자유",
    subtitle: "성공 후기 · 실패담 · 궁금한 것 — 뭐든 편하게 얘기해.",
  },
};

/**
 * URL / 서브바 별로 초기 board 를 결정.
 * - /emergency/kakao → contact
 * - /emergency/style → style
 * - /emergency/profile → profile
 * - /community/free → free
 * - 그 외 (/emergency, /community) → all
 * - ?board=... 쿼리가 있으면 그게 우선
 */
function resolveBoard(pathname: string, qs: string | null): Filter {
  if (qs === "contact" || qs === "style" || qs === "profile" || qs === "free") {
    return qs;
  }
  if (pathname.startsWith("/emergency/kakao")) return "contact";
  if (pathname.startsWith("/emergency/style")) return "style";
  if (pathname.startsWith("/emergency/profile")) return "profile";
  if (pathname.startsWith("/community/free")) return "free";
  return "all";
}

/**
 * 통합 커뮤니티 보드. 상단 서브바(nav)가 필터 역할을 하므로 페이지 내부 필터는 없음.
 * URL 별로 h1/설명 다르게, 해당 게시판 글만 노출.
 */
export function CommunityBoard() {
  const pathname = usePathname() ?? "/";
  const sp = useSearchParams();
  const filter = resolveBoard(pathname, sp?.get("board") ?? null);
  const meta = BOARD_META[filter];

  const posts = useMemo(() => {
    if (filter === "all") return hotPostsMock;
    return hotPostsMock.filter((p) => p.board === filter);
  }, [filter]);

  return (
    <main className="community-board">
      <div className="container">
        <header className="community-board__head">
          <h1 className="community-board__title">{meta.title}</h1>
          <p className="community-board__sub">{meta.subtitle}</p>
        </header>

        {posts.length === 0 ? (
          <div className="community-board__empty">
            아직 이 게시판 글 없어. 첫 글 남겨봐.
          </div>
        ) : (
          <ul className="community-board__list">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/community/post/${p.id}`}
                  className="community-post-card"
                >
                  <div className="community-post-card__meta">
                    <span className="community-post-card__board">
                      #{p.boardLabel}
                    </span>
                  </div>
                  <h2 className="community-post-card__title">{p.title}</h2>
                  {p.body && (
                    <p className="community-post-card__body">{p.body}</p>
                  )}
                  <div className="community-post-card__foot">
                    <span className="community-post-card__timeMeta">
                      <span>{p.createdAtRelative}</span>
                      <span>조회 {p.viewCount.toLocaleString("ko-KR")}</span>
                    </span>
                    <span className="community-post-card__stats">
                      <span className="community-post-card__reaction">
                        {p.board === "free" ? (
                          <Heart size={14} className="community-post-card__heart" />
                        ) : (
                          <SweetPotatoSymbol size={14} filled />
                        )}
                        {p.likes}
                      </span>
                      <span className="community-post-card__comments">
                        <CiderCommentIcon size={16} />
                        {p.commentCount}
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
