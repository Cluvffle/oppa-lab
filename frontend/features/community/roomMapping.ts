import type { ApiBoard } from "@/shared/lib/api";

/**
 * 할까말까 방 → 커뮤니티 게시판 매핑.
 *
 * 두 화면은 사실상 같은 데이터를 다르게 보여주는 것이라 백엔드 게시판을 공유한다.
 * relationship 은 대응 게시판이 없어 free 로 보낸다.
 */
export const ROOM_TO_BOARD: Record<string, ApiBoard> = {
  kakao: "contact",
  style: "style",
  profile: "profile",
  relationship: "free",
};

export function boardOfRoom(room: string): ApiBoard | undefined {
  return ROOM_TO_BOARD[room];
}
