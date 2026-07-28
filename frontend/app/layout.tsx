import type { Metadata } from "next";
import { Suspense } from "react";
import { BottomNav } from "@/shared/layout/BottomNav";
import "./globals.css";

// TODO: [[brand-cider]] 별칭 확정 시 "오빠" → 확정 별칭으로 교체
export const metadata: Metadata = {
  title: "사이다 (Cider) — 어색함이 자신감이 되는 놀이터",
  description:
    "사이다는 이성과의 대화 근육을 키우고, 어색함을 자신감으로 바꿔 실전 연애까지 나아가도록 돕는 놀이터입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}
