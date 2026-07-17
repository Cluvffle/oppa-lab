/**
 * 헤더 대분류(1단) + 서브바(2단) 구성.
 * 스킬 참조: [[concept]] — 서비스 지도, [[emergency-rooms]] — 오답노트 4방
 *
 * 규칙:
 * - 대분류: 헤더 상단 항상 노출
 * - 서브바: 활성 대분류에 sub[] 있으면 헤더 아래에 표시
 * - matcher: 현재 pathname 이 이 패턴들 중 하나에 매칭되면 해당 대분류가 활성
 * - 코드 식별자는 [[domain-model]] 기준(emergency/dating/coaching/community) 유지
 */

export interface NavSubItem {
  href: string;
  label: string;
  live?: boolean; // 실시간/새로움 도트 표시
}

export interface NavTab {
  key: string;
  label: string;
  href: string;
  matcher: (pathname: string) => boolean;
  sub?: NavSubItem[];
}

export const navTabs: NavTab[] = [
  // 홈 탭은 제거 — 헤더의 챠밍 로고 클릭이 홈 진입점.
  {
    key: "dating",
    label: "가짜 소개팅",
    href: "/dating",
    matcher: (p) => p.startsWith("/dating") || p.startsWith("/panels") || p.startsWith("/call"),
    sub: [
      { href: "/dating", label: "실시간", live: true },
      { href: "/dating/comments", label: "팩폭 후기", live: true },
    ],
  },
  {
    key: "coaching",
    label: "매력 트레이닝",
    href: "/coaching",
    matcher: (p) => p.startsWith("/coaching"),
    sub: [
      { href: "/coaching/talk", label: "대화법" },
      { href: "/coaching/style", label: "스타일" },
      { href: "/coaching/kakao", label: "카톡" },
      { href: "/coaching/reviews", label: "후기" },
    ],
  },
  {
    key: "notes",
    label: "오답노트",
    href: "/emergency",
    matcher: (p) => p.startsWith("/emergency"),
    sub: [
      { href: "/emergency/kakao", label: "카톡", live: true },
      { href: "/emergency/style", label: "스타일" },
      { href: "/emergency/profile", label: "프사" },
      { href: "/emergency/relationship", label: "관계", live: true },
    ],
  },
  {
    key: "lounge",
    label: "라운지",
    href: "/community",
    matcher: (p) => p.startsWith("/community") || p.startsWith("/feed"),
    sub: [
      { href: "/community/free", label: "자유", live: true },
      { href: "/feed", label: "어필 피드" },
      { href: "/community/growth-log", label: "성장일지" },
      { href: "/community/model-answers", label: "모범답안" },
      { href: "/community/real-interview", label: "리얼 인터뷰" },
      { href: "/community/grad", label: "졸업생" },
    ],
  },
];
