"use client";

import Link from "next/link";
import { ChevronRight, Settings, LogOut, Repeat } from "lucide-react";
import {
  CREATOR_TABS,
  USER_TABS,
  hrefForTab,
  type TabDef,
} from "@/features/mypage/lib/tabs";
import { TAB_ICON } from "@/features/mypage/lib/tabIcons";
import { useAuth } from "@/features/auth/useAuth";

interface Props {
  role: "user" | "creator";
}

/**
 * 마이페이지 홈.
 * - 상단: 프로필 카드 (아바타 · 별칭 + 🍠 고구마 잔고). 링크 아님.
 * - 서비스: role 별 탭 그리드 (오빠 = 내가 작성한 글 / 좋아요한 글 / 고구마 관리)
 * - 계정: 뷰 전환 · 로그아웃
 *
 * 스킬 참조: [[creator-economy]] 고구마 = 사이다 화폐 단위
 */
export function MypageHome({ role }: Props) {
  const { user, logout, switchRole } = useAuth();
  const tabs: TabDef[] = role === "creator" ? CREATOR_TABS : USER_TABS;

  const avatarSrc =
    role === "creator" ? "/avatars/cider-mascot.png" : "/avatars/sweet-potato.png";
  const avatarAlt = role === "creator" ? "사이다 친구" : "고구마 오빠";
  const nickname = user?.nickname ?? (role === "creator" ? "사이다 친구" : "익명 오빠");

  // 고구마 잔고 — 오빠(user) 만 노출. 실제 배선 전 mock 값.
  const sweetPotatoBalance = role === "user" ? 12400 : null;

  return (
    <div className="mypage-home">
      <div className="mypage-home__inner">
        <header className="mypage-home__head">
          <h1 className="mypage-home__h1">마이</h1>
          <Link href="#" className="mypage-home__gear" aria-label="설정">
            <Settings size={22} />
          </Link>
        </header>

        {/* 프로필 카드 — 클릭 불가. 오빠는 닉네임 아래 보유 고구마 명시 */}
        <div className="mypage-home__profile mypage-home__profile--static">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt={avatarAlt} className="mypage-home__avatar" />
          <div className="mypage-home__ident">
            <div className="mypage-home__nickname">{nickname}</div>
            {sweetPotatoBalance !== null && (
              <div className="mypage-home__balance-row">
                <span className="mypage-home__balance-label">보유 고구마</span>
                <span className="mypage-home__balance-value">
                  <span aria-hidden>🍠</span>
                  {sweetPotatoBalance.toLocaleString("ko-KR")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 서비스 그리드 */}
        <section className="mypage-home__section">
          <header className="mypage-home__section-head">
            <span className="mypage-home__section-title">
              {role === "creator" ? "친구 활동" : "서비스"}
            </span>
          </header>
          <div className="mypage-home__grid">
            {tabs.map((t) => {
              const Icon = TAB_ICON[t.key];
              return (
                <Link
                  key={t.key}
                  href={hrefForTab(role, t.key)}
                  className="mypage-home__tile"
                >
                  <span className="mypage-home__tile-icon" aria-hidden>
                    <Icon size={28} />
                  </span>
                  <span className="mypage-home__tile-label">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 계정 · 지원 */}
        <section className="mypage-home__section">
          <header className="mypage-home__section-head">
            <span className="mypage-home__section-title">계정</span>
          </header>
          <ul className="mypage-home__list">
            <li>
              <button
                type="button"
                className="mypage-home__row"
                onClick={switchRole}
              >
                <span className="mypage-home__row-icon" aria-hidden>
                  <Repeat size={20} />
                </span>
                <span className="mypage-home__row-label">
                  {role === "creator" ? "고구마 오빠 뷰로" : "사이다 친구 뷰로"}
                </span>
                <ChevronRight size={18} className="mypage-home__row-chev" aria-hidden />
              </button>
            </li>
            <li>
              <button
                type="button"
                className="mypage-home__row mypage-home__row--danger"
                onClick={logout}
              >
                <span className="mypage-home__row-icon" aria-hidden>
                  <LogOut size={20} />
                </span>
                <span className="mypage-home__row-label">로그아웃</span>
                <ChevronRight size={18} className="mypage-home__row-chev" aria-hidden />
              </button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
