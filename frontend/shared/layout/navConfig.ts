/**
 * 헤더 대분류(1단) + 서브바(2단) 구성.
 * 스킬 참조: [[concept]] — 서비스 지도, [[emergency-rooms]] — 커뮤니티 4방
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
  // 홈 탭은 제거 — 헤더의 사이다 로고 클릭이 홈 진입점.
  {
    key: "dating",
    label: "소개팅",
    href: "/dating",
    matcher: (p) => p.startsWith("/dating") || p.startsWith("/panels") || p.startsWith("/call"),
    sub: [
      { href: "/dating", label: "실시간", live: true },
      { href: "/dating/comments", label: "피드백", live: true },
    ],
  },
  {
    key: "notes",
    label: "커뮤니티",
    href: "/emergency",
    matcher: (p) =>
      p.startsWith("/emergency") || p.startsWith("/community"),
    sub: [
      { href: "/community", label: "전체" },
      { href: "/emergency/kakao", label: "연락", live: true },
      { href: "/emergency/style", label: "스타일" },
      { href: "/emergency/profile", label: "프사" },
      { href: "/community/free", label: "자유", live: true },
    ],
  },
  {
    key: "coaching",
    label: "매력 트레이닝",
    href: "/coaching",
    matcher: (p) => p.startsWith("/coaching"),
    // 대면 활동 5개 + 후기 = 7탭. 서브바는 '무엇을' 만 담고,
    // '누가 올렸는가' (사이다친구/고구마오빠) 는 리스트 상단 pill 필터 (?by=creator|user).
    sub: [
      { href: "/coaching", label: "전체" },
      { href: "/coaching?activity=wardrobe", label: "옷장" },
      { href: "/coaching?activity=photo", label: "인생샷" },
      { href: "/coaching?activity=cafe", label: "카페" },
      { href: "/coaching?activity=food", label: "맛집" },
      { href: "/coaching?activity=activity", label: "게임" },
      { href: "/coaching?view=reviews", label: "후기" },
    ],
  },
];
