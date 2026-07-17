/**
 * 마이페이지 role 스위칭.
 * 목업 단계 — ?role=creator 쿼리로 여성 뷰로 전환.
 * 실제 Auth 붙일 때 자연스럽게 세션 기반으로 대체.
 */

export type MypageRole = "user" | "creator";

export function readRoleFromSearchParams(
  sp: Record<string, string | string[] | undefined>
): MypageRole {
  const raw = sp.role;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "creator" ? "creator" : "user";
}
