"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, MessageCircleHeart, NotebookText, Users, User } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/shared/lib/cn";

interface Item {
  key: string;
  label: string;
  href: string;
  matcher: (p: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
}

/**
 * 모바일(700px 이하) 하단 sticky 탭바.
 * 5탭: 소개팅 · 커뮤니티 · 트레이닝 · 채팅 · 마이
 * - 홈 탭 제거 (헤더 로고 클릭이 홈 진입점)
 * - 채팅 = 진행 중인 스레드 목록 = /mypage/threads
 * - 마이 = /mypage 진입 (당근 스타일 그리드)
 * 활성 = accent 색 + 굵은 텍스트.
 */
export function BottomNav() {
  const pathname = usePathname() ?? "/";
  const { user, ready } = useAuth();

  const items: Item[] = [
    {
      key: "dating",
      label: "소개팅",
      href: "/dating",
      matcher: (p) =>
        p.startsWith("/dating") || p.startsWith("/panels") || p.startsWith("/call"),
      icon: (a) => <MessageCircleHeart size={22} strokeWidth={a ? 2.4 : 1.8} />,
    },
    {
      key: "notes",
      label: "커뮤니티",
      href: "/emergency",
      matcher: (p) => p.startsWith("/emergency") || p.startsWith("/community"),
      icon: (a) => <NotebookText size={22} strokeWidth={a ? 2.4 : 1.8} />,
    },
    {
      key: "coaching",
      label: "트레이닝",
      href: "/coaching",
      matcher: (p) => p.startsWith("/coaching"),
      icon: (a) => <Users size={22} strokeWidth={a ? 2.4 : 1.8} />,
    },
    {
      key: "chat",
      label: "채팅",
      href: ready && user ? "/mypage/threads" : "/",
      matcher: (p) => p.startsWith("/mypage/threads"),
      icon: (a) => <MessageCircle size={22} strokeWidth={a ? 2.4 : 1.8} />,
    },
    {
      key: "my",
      label: "마이",
      href: ready && user ? "/mypage" : "/",
      matcher: (p) => p.startsWith("/mypage") && !p.startsWith("/mypage/threads"),
      icon: (a) => <User size={22} strokeWidth={a ? 2.4 : 1.8} />,
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      {items.map((it) => {
        const active = it.matcher(pathname);
        return (
          <Link
            key={it.key}
            href={it.href}
            className={cn(
              "bottom-nav__item",
              active && "bottom-nav__item--active"
            )}
            aria-current={active ? "page" : undefined}
          >
            <span className="bottom-nav__icon" aria-hidden>
              {it.icon(active)}
            </span>
            <span className="bottom-nav__label">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
