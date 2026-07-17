"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { THEME_STORAGE_KEY, type Theme } from "@/shared/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // 마운트 시 현재 <html data-theme> 를 읽어와 상태 동기화 (init 스크립트가 이미 세팅함)
  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
      "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 프라이빗 모드 등 실패 무시
    }
  };

  // hydration 미스매치 방지: 마운트 전엔 아이콘 자리만 예약
  const icon = !mounted ? "🌗" : theme === "dark" ? "☀️" : "🌙";
  const label = !mounted
    ? "테마 전환"
    : theme === "dark"
      ? "라이트 모드로"
      : "다크 모드로";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );
}
