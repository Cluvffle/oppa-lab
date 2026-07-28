"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Repeat } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import {
  CREATOR_TABS,
  USER_TABS,
  hrefForTab,
  type TabDef,
} from "@/features/mypage/lib/tabs";
import { TAB_ICON } from "@/features/mypage/lib/tabIcons";
import { useAuth } from "@/features/auth/useAuth";

/**
 * 로그인 유저 헤더 아이콘 → 마이페이지 드롭다운.
 * 이미지 29 톤: 초록 링 프로필 트리거, 어두운 카드, 아이템별 아이콘 + 라벨,
 * 하단 로그아웃.
 */
export function UserMenu() {
  const { user, logout, switchRole } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? "/";
  const sp = useSearchParams();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 페이지 이동 시 닫힘
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!user) return null; // 비로그인 시 렌더 안 함 (Header 에서 로그인 버튼 노출)

  const role = user.role;
  const tabs: TabDef[] = role === "creator" ? CREATOR_TABS : USER_TABS;
  // ?role=creator 쿼리 유지 (링크 공유용)
  const roleQuery = sp?.get("role");
  // 오빠 뷰(user) = 고구마 마스코트, 여성 뷰(creator) = 사이다 마스코트
  const avatarSrc =
    role === "creator" ? "/avatars/cider-mascot.png" : "/avatars/sweet-potato.png";
  const avatarAlt = role === "creator" ? "사이다 마스코트" : "고구마 오빠";

  return (
    <div ref={containerRef} className="user-menu">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn("user-menu__trigger", open && "user-menu__trigger--open")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="마이페이지 메뉴"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={avatarAlt}
          className="user-menu__trigger-avatar"
        />
      </button>

      {open && (
        <div className="user-menu__panel" role="menu">
          <div className="user-menu__header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={avatarAlt}
              className="user-menu__avatar"
            />

            <div className="user-menu__ident">
              <div className="user-menu__nickname-row">
                <span className="user-menu__nickname">{user.nickname}</span>
              </div>
            </div>
          </div>

          <ul className="user-menu__list">
            {tabs.map((t) => {
              const Icon = TAB_ICON[t.key];
              const href = hrefForTab(role, t.key);
              const isActive =
                pathname === `/mypage/${t.key}` ||
                (t.key === tabs[0].key && pathname === "/mypage");
              return (
                <li key={t.key}>
                  <Link
                    href={href}
                    className={cn(
                      "user-menu__item",
                      isActive && "user-menu__item--active"
                    )}
                    role="menuitem"
                  >
                    <span className="user-menu__item-icon" aria-hidden>
                      <Icon size={22} />
                    </span>
                    <span className="user-menu__item-label">{t.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="user-menu__footer">
            {/* 개발용 role 스위치 — 실제 로그인 붙일 때 제거 */}
            {roleQuery ? null : (
              <button
                type="button"
                className="user-menu__ghost-btn"
                onClick={switchRole}
              >
                <Repeat size={14} />
                {role === "creator" ? "고구마 오빠 뷰로" : "사이다 친구 뷰로"}
              </button>
            )}
            <button
              type="button"
              className="user-menu__logout-btn"
              onClick={logout}
            >
              <LogOut size={14} />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
