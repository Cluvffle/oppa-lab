"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X, Search } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { navTabs } from "./navConfig";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 모바일 좌측 슬라이드 드로어.
 * 헤더 햄버거 버튼(700px 이하 표시)에서 열림.
 * 대분류 + 하위 서브바 항목을 계층 리스트로 노출.
 */
export function MobileDrawer({ open, onClose }: Props) {
  const pathname = usePathname() ?? "/";

  // 열림 시 body 스크롤 락 + ESC 닫기
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // 페이지 이동 시 자동 닫힘
  useEffect(() => {
    onClose();
    // pathname 변할 때만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        className={cn("mobile-drawer__scrim", open && "mobile-drawer__scrim--open")}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={cn("mobile-drawer", open && "mobile-drawer--open")}
        role="dialog"
        aria-modal="true"
        aria-label="주 메뉴"
      >
        <div className="mobile-drawer__head">
          <Link href="/" className="mobile-drawer__logo" onClick={onClose}>
            챠밍<span className="mobile-drawer__logo-dot">.</span>
          </Link>
          <button
            type="button"
            className="mobile-drawer__close"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X size={22} />
          </button>
        </div>

        <label className="mobile-drawer__search">
          <Search size={16} />
          <input
            type="search"
            placeholder="친구, 게시글, 대화 주제 검색"
            aria-label="통합 검색"
          />
        </label>

        <Link
          href="/dating"
          className="mobile-drawer__cta"
          onClick={onClose}
        >
          🟢 지금 대화 가능
        </Link>

        <nav className="mobile-drawer__nav" aria-label="주 메뉴">
          {navTabs.map((tab) => {
            const isActive = tab.matcher(pathname);
            return (
              <div key={tab.key} className="mobile-drawer__group">
                <Link
                  href={tab.href}
                  className={cn(
                    "mobile-drawer__tab",
                    isActive && "mobile-drawer__tab--active"
                  )}
                  onClick={onClose}
                >
                  {tab.label}
                </Link>
                {tab.sub && (
                  <ul className="mobile-drawer__sublist">
                    {tab.sub.map((s) => {
                      const isSubActive =
                        pathname === s.href ||
                        (s.href !== tab.href && pathname.startsWith(s.href + "/"));
                      return (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            className={cn(
                              "mobile-drawer__subitem",
                              isSubActive && "mobile-drawer__subitem--active"
                            )}
                            onClick={onClose}
                          >
                            {s.label}
                            {s.live && (
                              <span className="mobile-drawer__dot" aria-label="실시간" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
