/**
 * 마이페이지 탭 정의. role 별로 순서/라벨이 다름.
 * 첫 번째 탭이 기본 (?tab 없으면 여기).
 */

export type MypageTabKey =
  | "threads"
  | "growth"
  | "emergency"
  | "billing"
  | "todo"
  | "schedule"
  | "payout"
  | "activity"
  // ─── 오빠(user) 마이 신 서비스 그리드 ───
  | "posts" // 작성한 글
  | "liked" // 좋아요한 글
  | "sweetpotato" // 고구마 관리 (충전/사용내역/가격표)
  | "settings"; // 설정

export interface TabDef {
  key: MypageTabKey;
  label: string;
}

export const USER_TABS: TabDef[] = [
  { key: "posts", label: "작성한 글" },
  { key: "liked", label: "좋아요한 글" },
  { key: "sweetpotato", label: "고구마 관리" },
  { key: "settings", label: "설정" },
];

export const CREATOR_TABS: TabDef[] = [
  { key: "threads", label: "내 상대들" },
  { key: "todo", label: "오늘 할 일" },
  { key: "schedule", label: "가능 시간" },
  { key: "payout", label: "정산 · 포인트" },
  { key: "activity", label: "내 활동" },
];

export function resolveActiveTab(
  role: "user" | "creator",
  raw: string | undefined
): MypageTabKey {
  const list = role === "creator" ? CREATOR_TABS : USER_TABS;
  const match = list.find((t) => t.key === raw);
  return match?.key ?? list[0].key;
}

export function tabsFor(role: "user" | "creator"): TabDef[] {
  return role === "creator" ? CREATOR_TABS : USER_TABS;
}

/** 세그먼트 경로 매핑 — 항상 /mypage/{key} */
export function hrefForTab(role: "user" | "creator", key: MypageTabKey): string {
  const base = `/mypage/${key}`;
  return role === "creator" ? `${base}?role=creator` : base;
}

