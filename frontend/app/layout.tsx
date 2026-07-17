import type { Metadata } from "next";
import { themeInitScript } from "@/shared/lib/theme";
import "./globals.css";

// TODO: [[brand-charming]] 별칭 확정 시 "오빠" → 확정 별칭으로 교체
export const metadata: Metadata = {
  title: "챠밍 (Charming) — 어색함이 자신감이 되는 놀이터",
  description:
    "챠밍은 이성과의 대화 근육을 키우고, 어색함을 자신감으로 바꿔 실전 연애까지 나아가도록 돕는 놀이터입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* FOUC 방지: 렌더 전 즉시 저장된 테마 or 시스템 테마 적용 */}
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
