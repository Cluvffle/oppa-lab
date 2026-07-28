"use client";

/**
 * 유저가 스스로 만든 채팅방 저장소 (localStorage).
 *
 * mock 스레드(t1~t4) 는 selectors 에서 별도로 관리. 여기는
 * `/dating` 등에서 "채팅 걸기" 로 새로 열린 상시 채팅방과 그 메시지를 담는다.
 *
 * 실서비스 붙일 때 이 API 를 그대로 REST 로 대체하면 UI 는 안 건드려도 됨.
 */

import { CURRENT_USER_ID } from "@/shared/lib/mock";

const THREADS_KEY = "cider:user-threads:v1";
const MSGS_KEY_PREFIX = "cider:chat:v1:";
const QUICKCALL_KEY_PREFIX = "cider:qc:v1:"; // threadId 별 활성 QuickCallRequest
const APPT_KEY_PREFIX = "cider:appt:v1:"; // threadId 별 약속 목록
const CALL_ENDED_KEY_PREFIX = "cider:call-end:v1:"; // threadId 별 마지막 통화 종료 시각
const MEET_REQ_KEY_PREFIX = "cider:meet-req:v1:"; // threadId 별 "만남 요청" 마커 (24h)
const EVENT_NAME = "cider:chat-changed";

/** QuickCallRequest TTL: 30분 */
export const QUICKCALL_TTL_MS = 30 * 60 * 1000;
/** 채팅 open window: 통화/만남 종료 후 24h · 약속 예정 24h 전~후 */
export const CHAT_OPEN_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ChatEventDetail = { threadId?: string };

export interface UserThreadRecord {
  /** t_chat_<creatorId> */
  threadId: string;
  creatorId: string;
  createdAt: string;
}

export interface StoredMessage {
  id: string;
  senderId: string; // user id or creator id
  senderRole: "user" | "creator" | "system";
  body: string;
  createdAt: string;
}

/* ------------------------- SSR-safe helpers ------------------------- */

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy mode
  }
}

function emit(detail: ChatEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ChatEventDetail>(EVENT_NAME, { detail }));
}

/* ---------------------------- Public API ---------------------------- */

export function threadIdForCreator(creatorId: string): string {
  return `t_chat_${creatorId}`;
}

/** t_chat_<creatorId> 형태에서 creatorId 추출. 아니면 null. */
export function parseUserThreadId(threadId: string): string | null {
  if (!threadId.startsWith("t_chat_")) return null;
  return threadId.slice("t_chat_".length);
}

export function listUserThreads(): UserThreadRecord[] {
  return safeGet<UserThreadRecord[]>(THREADS_KEY, []);
}

export function addChatThread(creatorId: string): UserThreadRecord {
  const threadId = threadIdForCreator(creatorId);
  const list = listUserThreads();
  const existing = list.find((t) => t.threadId === threadId);
  if (existing) return existing;
  const rec: UserThreadRecord = {
    threadId,
    creatorId,
    createdAt: new Date().toISOString(),
  };
  safeSet(THREADS_KEY, [rec, ...list]);
  emit({ threadId });
  return rec;
}

export function removeChatThread(threadId: string): void {
  const next = listUserThreads().filter((t) => t.threadId !== threadId);
  safeSet(THREADS_KEY, next);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(MSGS_KEY_PREFIX + threadId);
  }
  emit({ threadId });
}

/* ------------------------------ Messages ---------------------------- */

function msgsKey(threadId: string): string {
  return MSGS_KEY_PREFIX + threadId;
}

export function listMessages(threadId: string): StoredMessage[] {
  return safeGet<StoredMessage[]>(msgsKey(threadId), []);
}

export function appendMessage(
  threadId: string,
  input: Omit<StoredMessage, "id" | "createdAt"> &
    Partial<Pick<StoredMessage, "createdAt">>
): StoredMessage {
  const msg: StoredMessage = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: input.createdAt ?? new Date().toISOString(),
    senderId: input.senderId,
    senderRole: input.senderRole,
    body: input.body,
  };
  const list = listMessages(threadId);
  safeSet(msgsKey(threadId), [...list, msg]);
  emit({ threadId });
  return msg;
}

/** 첫 방문 시스템 안내 메시지 자동 추가 (한 번만). */
export function seedGreetingIfEmpty(
  threadId: string,
  creatorNickname: string
): void {
  const list = listMessages(threadId);
  if (list.length > 0) return;
  appendMessage(threadId, {
    senderId: "system",
    senderRole: "system",
    body: `${creatorNickname}랑 대화 시작해봐. 통화 요청이나 약속잡기로만 대화가 열려. 평상시엔 히스토리만 볼 수 있어.`,
  });
}

/* ========================================================================
 *  QuickCallRequest — "지금 통화 되냐?" 요청 세션.
 *  오빠가 요청 → 여성이 30분 안에 수락하면 통화방 열림. 미수락 시 만료.
 * ==================================================================== */

export type QuickCallStatus = "pending" | "accepted" | "expired" | "declined";

export interface QuickCallRequest {
  threadId: string;
  requestedBy: string;
  status: QuickCallStatus;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

function qcKey(threadId: string): string {
  return QUICKCALL_KEY_PREFIX + threadId;
}

export function getActiveQuickCall(
  threadId: string,
  now: Date = new Date()
): QuickCallRequest | null {
  const raw = safeGet<QuickCallRequest | null>(qcKey(threadId), null);
  if (!raw) return null;
  if (raw.status === "accepted") return raw; // 수락된 것도 유효 표시
  if (raw.status !== "pending") return null;
  if (new Date(raw.expiresAt).getTime() < now.getTime()) {
    // 자동 만료 처리 (조회 시)
    safeSet(qcKey(threadId), { ...raw, status: "expired" });
    return null;
  }
  return raw;
}

export function requestQuickCall(
  threadId: string,
  requestedBy: string
): QuickCallRequest {
  const now = new Date();
  const rec: QuickCallRequest = {
    threadId,
    requestedBy,
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + QUICKCALL_TTL_MS).toISOString(),
  };
  safeSet(qcKey(threadId), rec);
  emit({ threadId });
  return rec;
}

export function acceptQuickCall(threadId: string): QuickCallRequest | null {
  const raw = safeGet<QuickCallRequest | null>(qcKey(threadId), null);
  if (!raw || raw.status !== "pending") return null;
  const updated: QuickCallRequest = {
    ...raw,
    status: "accepted",
    acceptedAt: new Date().toISOString(),
  };
  safeSet(qcKey(threadId), updated);
  emit({ threadId });
  return updated;
}

export function declineQuickCall(threadId: string): void {
  const raw = safeGet<QuickCallRequest | null>(qcKey(threadId), null);
  if (!raw || raw.status !== "pending") return;
  safeSet(qcKey(threadId), { ...raw, status: "declined" });
  emit({ threadId });
}

/** 통화방에서 실제 통화 종료 시 호출 (24h 여운 창 시작점). */
export function markCallEnded(threadId: string, at: Date = new Date()): void {
  safeSet(CALL_ENDED_KEY_PREFIX + threadId, at.toISOString());
  emit({ threadId });
}

export function getLastCallEndedAt(threadId: string): string | null {
  return safeGet<string | null>(CALL_ENDED_KEY_PREFIX + threadId, null);
}

/* ========================================================================
 *  Appointment — 오프라인(실전만남) 예약.
 *  약속 확정 순간부터 예정 시각 24h 후까지 채팅 open.
 * ==================================================================== */

export interface Appointment {
  id: string;
  threadId: string;
  creatorId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  location: string;
  createdAt: string;
}

function apptKey(threadId: string): string {
  return APPT_KEY_PREFIX + threadId;
}

export function listAppointments(threadId: string): Appointment[] {
  return safeGet<Appointment[]>(apptKey(threadId), []);
}

export function addAppointment(
  threadId: string,
  creatorId: string,
  input: { date: string; time: string; location: string }
): Appointment {
  const rec: Appointment = {
    id: `appt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    threadId,
    creatorId,
    date: input.date,
    time: input.time,
    location: input.location,
    createdAt: new Date().toISOString(),
  };
  const list = listAppointments(threadId);
  safeSet(apptKey(threadId), [...list, rec]);
  emit({ threadId });
  return rec;
}

/** 전체 스레드의 약속 목록 (캘린더용). */
export function listAllAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  const all: Appointment[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith(APPT_KEY_PREFIX)) continue;
    try {
      const arr = JSON.parse(window.localStorage.getItem(key) || "[]");
      if (Array.isArray(arr)) all.push(...arr);
    } catch {
      // ignore
    }
  }
  return all;
}

/* ========================================================================
 *  MeetRequest — 친구 카드에서 "만남 요청" 클릭 시 여는 조율 창구.
 *  실제 시간/장소는 채팅 안에서 대화 or `+ → 약속잡기` 로 정함.
 *  단순히 채팅을 24h open 하기 위한 마커.
 * ==================================================================== */

export interface MeetRequestMarker {
  threadId: string;
  requestedBy: string;
  createdAt: string;
  expiresAt: string;
}

function meetReqKey(threadId: string): string {
  return MEET_REQ_KEY_PREFIX + threadId;
}

export function requestMeet(
  threadId: string,
  requestedBy: string
): MeetRequestMarker {
  const now = new Date();
  const rec: MeetRequestMarker = {
    threadId,
    requestedBy,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CHAT_OPEN_WINDOW_MS).toISOString(),
  };
  safeSet(meetReqKey(threadId), rec);
  emit({ threadId });
  return rec;
}

export function getActiveMeetRequest(
  threadId: string,
  now: Date = new Date()
): MeetRequestMarker | null {
  const raw = safeGet<MeetRequestMarker | null>(meetReqKey(threadId), null);
  if (!raw) return null;
  if (new Date(raw.expiresAt).getTime() < now.getTime()) return null;
  return raw;
}

/** 예약된 만남 중 아직 시간 안 지난 것 (가장 가까운 것 하나). */
export function getUpcomingAppointment(
  threadId: string,
  now: Date = new Date()
): Appointment | null {
  const list = listAppointments(threadId);
  const upcoming = list
    .filter((a) => new Date(`${a.date}T${a.time}:00`).getTime() > now.getTime())
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}:00`).getTime() -
        new Date(`${b.date}T${b.time}:00`).getTime()
    );
  return upcoming[0] ?? null;
}

export function currentUserId(): string {
  return CURRENT_USER_ID;
}

/* ------------------------------ Subscribe --------------------------- */

/** React 컴포넌트에서 useEffect 로 등록. cleanup 반환. */
export function subscribeChatChanged(
  handler: (detail: ChatEventDetail) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const onEvent = (e: Event) => {
    const ce = e as CustomEvent<ChatEventDetail>;
    handler(ce.detail ?? {});
  };
  const onStorage = (e: StorageEvent) => {
    if (!e.key) return;
    const prefixes = [
      MSGS_KEY_PREFIX,
      QUICKCALL_KEY_PREFIX,
      APPT_KEY_PREFIX,
      CALL_ENDED_KEY_PREFIX,
      MEET_REQ_KEY_PREFIX,
    ];
    if (e.key === THREADS_KEY) {
      handler({});
      return;
    }
    for (const p of prefixes) {
      if (e.key.startsWith(p)) {
        handler({ threadId: e.key.slice(p.length) });
        return;
      }
    }
  };
  window.addEventListener(EVENT_NAME, onEvent as EventListener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onEvent as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}
