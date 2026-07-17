"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
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
            챠밍<span className="header-logo-dot">.</span>
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

        {/* 우측: 테마 + (로그인 시) 유저 메뉴 / (비로그인) 로그인 버튼 */}
        <div className="header-actions">
          <ThemeToggle />
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
            {activeTab.sub.map((s) => {
              const isSubActive =
                pathname === s.href ||
                (s.href !== activeTab.href && pathname.startsWith(s.href + "/"));
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
