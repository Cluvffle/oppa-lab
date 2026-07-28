"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { CiderBellIcon } from "@/shared/ui/CiderBellIcon";
import { navTabs } from "./navConfig";
import { UserMenu } from "./UserMenu";
import { MobileDrawer } from "./MobileDrawer";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/shared/lib/cn";

export function Header() {
  const pathname = usePathname() ?? "/";
  const activeTab = navTabs.find((t) => t.matcher(pathname));
  const { user, ready, login } = useAuth();
  const sp = useSearchParams();
  const roleQuery = sp?.get("role") === "creator" ? "creator" : "user";
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        {/* 좌측: 햄버거 + 로고 + 탭 네비 */}
        <div className="header-left">
          <button
            className="header-menu-btn"
            aria-label="메뉴 열기"
            aria-expanded={drawerOpen}
            type="button"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="header-logo">
            사이다<span className="header-logo-dot">.</span>
          </Link>

          <nav className="header-nav" aria-label="주 메뉴">
            {navTabs.map((tab) => {
              const isActive = activeTab?.key === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={cn(
                    "header-tab",
                    isActive && "header-tab--active"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* 강조 CTA — 지금 대화 가능한 친구로 바로 진입 */}
          <Link href="/dating" className="header-pill">
            🟢 지금 대화 가능
          </Link>
        </div>

        {/* 중앙: 검색바 */}
        <label className="header-search">
          <Search size={18} className="header-search__icon" />
          <input
            type="search"
            placeholder="친구, 게시글, 대화 주제 검색"
            aria-label="통합 검색"
          />
        </label>

        {/* 우측: 알림 종 + (로그인 시) 유저 메뉴 / (비로그인) 로그인 버튼 */}
        <div className="header-actions">
          {ready && user && (
            <button
              type="button"
              className="header-icon-btn"
              aria-label="알림"
              title="알림"
            >
              <CiderBellIcon size={26} hasUnread />
            </button>
          )}
          {ready && user ? (
            <UserMenu />
          ) : ready ? (
            <Button size="sm" onClick={() => login(roleQuery)}>
              로그인
            </Button>
          ) : null}
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* 2단 서브바 — 활성 대분류의 sub[]가 있을 때만 */}
      {activeTab?.sub && (
        <div className="subbar">
          <div className="subbar-inner">
            {activeTab.sub.map((s, idx) => {
              const isSubActive = matchSubHref(s.href, pathname, sp, activeTab.sub!, idx);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={cn(
                    "subbar-pill",
                    isSubActive && "subbar-pill--active"
                  )}
                >
                  {s.label}
                  {s.live && (
                    <span className="subbar-pill__dot" aria-label="실시간" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * 서브바 pill 활성 판정.
 * - 쿼리(?activity=xxx) 를 포함한 href 는 pathname + 해당 쿼리키 값이 정확히 일치해야 활성
 * - 쿼리 없는 href 는 기존 로직 (경로 정확/하위)
 * - 어떤 sub 도 매칭 안 되면 첫 sub 를 기본 활성 (단, 활성 sub 가 쿼리 있는데
 *   현재 URL 에 아무 쿼리도 없으면 활성 판정 필요)
 */
function matchSubHref(
  href: string,
  pathname: string,
  sp: ReturnType<typeof useSearchParams>,
  siblings: { href: string }[],
  idx: number
): boolean {
  const parseHref = (h: string): { path: string; query: Record<string, string> } => {
    const [path, qs] = h.split("?");
    const query: Record<string, string> = {};
    if (qs) {
      for (const pair of qs.split("&")) {
        const [k, v] = pair.split("=");
        query[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
      }
    }
    return { path, query };
  };
  const { path, query } = parseHref(href);
  const queryEntries = Object.entries(query);
  const isQueryDriven = queryEntries.length > 0;

  const currentQueryMatches = (): boolean => {
    for (const [k, v] of queryEntries) {
      if ((sp?.get(k) ?? "") !== v) return false;
    }
    return true;
  };

  // 다른 sub 도 이 pathname 을 접두어로 갖는 경우: 정확 매칭만 인정
  const isPrefixOfOtherSub = siblings.some((x) => {
    const other = parseHref(x.href).path;
    return other !== path && other.startsWith(path + "/");
  });

  let pathMatches = false;
  if (isQueryDriven) {
    // 쿼리 기반: pathname 정확 일치 + 쿼리 값 일치
    pathMatches = pathname === path && currentQueryMatches();
  } else if (isPrefixOfOtherSub) {
    pathMatches = pathname === path;
  } else {
    pathMatches = pathname === path || pathname.startsWith(path + "/");
  }

  if (pathMatches) {
    // 쿼리 있는 sibling 이 이미 활성이면 이 pill 은 활성 아님
    if (!isQueryDriven) {
      // 이 sub 는 쿼리 없는데, 쿼리 있는 sibling 이 활성일 수 있음
      const queriedSiblingActive = siblings.some((x) => {
        if (x.href === href) return false;
        const parsed = parseHref(x.href);
        if (parsed.path !== pathname) return false;
        const entries = Object.entries(parsed.query);
        if (entries.length === 0) return false;
        return entries.every(([k, v]) => (sp?.get(k) ?? "") === v);
      });
      if (queriedSiblingActive) return false;
    }
    return true;
  }

  // fallback: 이 sub 가 첫 번째이고 형제 중 아무도 매칭 안 되면 활성
  if (idx === 0) {
    const anySubMatches = siblings.some((x) => {
      const parsed = parseHref(x.href);
      if (Object.keys(parsed.query).length > 0) {
        if (pathname !== parsed.path) return false;
        return Object.entries(parsed.query).every(
          ([k, v]) => (sp?.get(k) ?? "") === v
        );
      }
      const otherPref = siblings.some((y) => {
        const yp = parseHref(y.href).path;
        return yp !== parsed.path && yp.startsWith(parsed.path + "/");
      });
      return otherPref
        ? pathname === parsed.path
        : pathname === parsed.path || pathname.startsWith(parsed.path + "/");
    });
    return !anySubMatches;
  }
  return false;
}
