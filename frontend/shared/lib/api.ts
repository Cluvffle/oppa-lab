/**
 * Cider Backend API 클라이언트.
 *
 * 현재는 커뮤니티 읽기 전용으로만 쓴다.
 * 글쓰기·댓글·반응은 JWT가 필요한데 웹 로그인이 아직 없어서 mock 을 유지한다.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dev.cluvffle.co.kr";

/** 백엔드 ResponseInterceptor 가 씌우는 공통 봉투. */
interface Envelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

export type ApiBoard = "contact" | "style" | "profile" | "free";

export interface ApiReactionCounts {
  sweet_potato: number;
  cider: number;
  heart: number;
}

export interface ApiPost {
  id: string;
  board: ApiBoard;
  title: string | null;
  content: string;
  reactions: ApiReactionCounts;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPostList {
  items: ApiPost[];
  page: number;
  limit: number;
  total: number;
}

async function get<T>(path: string, revalidate = 30): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`API ${path} 실패 (${res.status})`);
  }
  const body = (await res.json()) as Envelope<T>;
  return body.data;
}

export function fetchPosts(params?: {
  board?: ApiBoard;
  page?: number;
  limit?: number;
}): Promise<ApiPostList> {
  const q = new URLSearchParams();
  if (params?.board) q.set("board", params.board);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return get<ApiPostList>(`/community/posts${qs ? `?${qs}` : ""}`);
}

export function fetchPost(id: string): Promise<ApiPost> {
  return get<ApiPost>(`/community/posts/${id}`);
}

/**
 * API 가 죽어 있어도 화면이 깨지지 않도록 빈 결과로 떨어뜨린다.
 * 커뮤니티는 부가 영역이라 전체 페이지를 실패시킬 이유가 없다.
 */
export async function fetchPostsSafe(params?: {
  board?: ApiBoard;
  page?: number;
  limit?: number;
}): Promise<ApiPostList> {
  try {
    return await fetchPosts(params);
  } catch {
    return { items: [], page: 1, limit: params?.limit ?? 20, total: 0 };
  }
}
