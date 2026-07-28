/**
 * mock.ts 데이터에서 스레드 뷰에 필요한 파생 데이터를 뽑는 selector 모음.
 * 실제 API 붙일 때 이 함수 시그니처들이 서비스 계층으로 옮겨감.
 * 스킬 참조: [[domain-model]]
 */

import {
  CURRENT_USER_ID,
  afterRequestsMock,
  bookingsMock,
  chatMessagesMock,
  coordinationChatsMock,
  creatorsMock,
  datingMeetsMock,
  datingThreadsMock,
  type AfterRequestMock,
  type BookingMock,
  type ChatMessageMock,
  type CoordinationChatMock,
  type CreatorMock,
  type DatingMeetMock,
  type DatingThreadMock,
  type MeetTier,
} from "@/shared/lib/mock";

export interface ThreadSummary {
  thread: DatingThreadMock;
  creator: CreatorMock;
  totalMeetCount: number;
  completedMeets: DatingMeetMock[];
  latestMeet?: DatingMeetMock;
  /** 아직 시간 확정 안 된 조율 중 신청 (있으면 신규 신청 잠금) */
  schedulingRequest?: AfterRequestMock;
  schedulingChat?: CoordinationChatMock;
  /** 예약 확정된, 아직 진행 안 한 회차 */
  upcomingMeet?: DatingMeetMock;
  upcomingBooking?: BookingMock;
  /** UI 상단 뱃지 문구 */
  statusLabel: ThreadStatusLabel;
}

export type ThreadStatusLabel =
  | { kind: "scheduling"; text: string }
  | { kind: "upcoming"; text: string; when: string; tier: MeetTier; location?: string }
  | { kind: "awaiting_feedback"; text: string }
  | { kind: "ready_for_after"; text: string }
  | { kind: "paused"; text: string };

export function getUserThreadSummaries(userId = CURRENT_USER_ID): ThreadSummary[] {
  const list = datingThreadsMock.filter((t) => t.userId === userId);
  return list.map(buildSummary).sort(byMostRecentFirst);
}

/** 여성(=크리에이터) 관점: 이 크리에이터가 참여 중인 모든 스레드 */
export function getCreatorThreadSummaries(creatorId: string): ThreadSummary[] {
  const list = datingThreadsMock.filter((t) => t.creatorId === creatorId);
  return list.map(buildSummary).sort(byMostRecentFirst);
}

export function getThreadSummaryById(threadId: string): ThreadSummary | undefined {
  const t = datingThreadsMock.find((x) => x.id === threadId);
  if (!t) return undefined;
  return buildSummary(t);
}

/* ------------------------------- 내부 ------------------------------- */

function buildSummary(thread: DatingThreadMock): ThreadSummary {
  const creator = creatorsMock.find((c) => c.id === thread.creatorId)!;
  const meets = datingMeetsMock.filter((m) => m.threadId === thread.id);
  const completedMeets = meets
    .filter((m) => m.status === "completed")
    .sort((a, b) => (a.meetNumber < b.meetNumber ? 1 : -1)); // 최신 먼저
  const latestMeet = completedMeets[0];

  const scheduledMeet = meets.find((m) => m.status === "scheduled");
  const upcomingBooking = scheduledMeet
    ? bookingsMock.find((b) => b.meetId === scheduledMeet.id)
    : undefined;

  const schedulingRequest = afterRequestsMock.find(
    (r) => r.threadId === thread.id && r.status === "scheduling"
  );
  const schedulingChat = schedulingRequest
    ? coordinationChatsMock.find((c) => c.afterRequestId === schedulingRequest.id)
    : undefined;

  const statusLabel = deriveStatusLabel({
    thread,
    schedulingRequest,
    upcomingMeet: scheduledMeet,
    upcomingBooking,
    latestMeet,
  });

  return {
    thread,
    creator,
    totalMeetCount: thread.voiceCount + thread.offlineCount,
    completedMeets,
    latestMeet,
    schedulingRequest,
    schedulingChat,
    upcomingMeet: scheduledMeet,
    upcomingBooking,
    statusLabel,
  };
}

function deriveStatusLabel(args: {
  thread: DatingThreadMock;
  schedulingRequest?: AfterRequestMock;
  upcomingMeet?: DatingMeetMock;
  upcomingBooking?: BookingMock;
  latestMeet?: DatingMeetMock;
}): ThreadStatusLabel {
  const { thread, schedulingRequest, upcomingMeet, upcomingBooking, latestMeet } = args;

  if (thread.status !== "active") {
    return { kind: "paused", text: statusPausedText(thread.status) };
  }
  if (schedulingRequest) {
    return { kind: "scheduling", text: "시간 조율 중" };
  }
  if (upcomingMeet && upcomingBooking?.scheduledAt) {
    return {
      kind: "upcoming",
      text: "예약 확정",
      when: upcomingBooking.scheduledAt,
      tier: upcomingBooking.tier,
      location: upcomingBooking.location,
    };
  }
  if (latestMeet && !latestMeet.reportId && latestMeet.feedbackSummary === undefined) {
    return { kind: "awaiting_feedback", text: "피드백 대기 중" };
  }
  return { kind: "ready_for_after", text: "다음 애프터 신청 가능" };
}

function statusPausedText(s: DatingThreadMock["status"]): string {
  switch (s) {
    case "paused":
      return "일시 정지";
    case "closed_by_user":
      return "내가 종료함";
    case "closed_by_creator":
      return "상대가 종료함";
    case "closed_by_moderation":
      return "운영 정지";
    default:
      return "정지";
  }
}

function byMostRecentFirst(a: ThreadSummary, b: ThreadSummary): number {
  const at = a.thread.lastMeetAt ?? a.thread.createdAt;
  const bt = b.thread.lastMeetAt ?? b.thread.createdAt;
  return at < bt ? 1 : -1;
}

/* ------------------------ 회차/채팅 상세 selectors ------------------------ */

export function getMeetsByThread(threadId: string): DatingMeetMock[] {
  return datingMeetsMock
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.meetNumber - b.meetNumber);
}

export function getChatWithMessages(chatId: string): {
  chat: CoordinationChatMock;
  messages: ChatMessageMock[];
} | undefined {
  const chat = coordinationChatsMock.find((c) => c.id === chatId);
  if (!chat) return undefined;
  const messages = chatMessagesMock
    .filter((m) => m.chatId === chatId)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  return { chat, messages };
}

export function getMonthlyUsage(userId = CURRENT_USER_ID, now = new Date()): {
  used: number;
  limit: number;
} {
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  const startIso = start.toISOString();
  const used = datingMeetsMock.filter((m) => {
    if (m.status !== "completed") return false;
    if (!m.endedAt) return false;
    const t = datingThreadsMock.find((x) => x.id === m.threadId);
    if (!t || t.userId !== userId) return false;
    return m.endedAt >= startIso;
  }).length;
  return { used, limit: 3 }; // mission #3 지명 통화 월 상한 기본값
}

export function countCreatorPendingFeedback(creatorId: string): number {
  const threadIds = new Set(
    datingThreadsMock.filter((t) => t.creatorId === creatorId).map((t) => t.id)
  );
  return datingMeetsMock.filter(
    (m) =>
      threadIds.has(m.threadId) &&
      m.status === "completed" &&
      !m.reportId &&
      m.feedbackSummary === undefined
  ).length;
}

/* ========================================================================
 *  ChatList (2-pane 마이페이지) 용 파생 데이터
 *  - 리스트 미리보기(1줄) 는 조율 채팅 마지막 메시지 · 최근 피드백 · 시스템 이벤트를
 *    시간순 병합해서 최신 하나만 노출.
 *  - chatOpenState: 통화 예정 24h 전 ~ 통화 종료 후 24h 만 open,
 *    그 외 평상시는 readonly (히스토리 열람만) — [[mission]] 절대룰 3 준수.
 * ==================================================================== */

export type ChatOpenState = "open" | "read_only" | "locked";

/**
 * 채팅 open 판정 — 세 트리거 중 하나가 활성이어야 open.
 *   1) 활성 QuickCallRequest (오빠가 지금 통화 요청, 30분 창)
 *   2) 활성 조율 채팅 (약속 잡는 중, 확정 or 24h 만료 전)
 *   3) 마지막 통화/만남 종료 후 24h 여운
 *
 * mock 은 서버 SSR 렌더용 baseline (조율 채팅/upcoming booking 만 반영),
 * 클라이언트에선 ThreadsWorkspace 가 localStorage(QuickCall/appt/callEnd) 병합해서 재계산.
 */

export interface LatestActivity {
  kind: "message" | "feedback" | "system";
  /** 리스트 1줄 미리보기 텍스트 */
  preview: string;
  /** ISO */
  at: string;
  /** 안 읽음 카운트 계산용 (뷰어가 아직 못 본 시각 기준) */
  senderIsMe: boolean;
}

export interface ThreadListItem {
  summary: ThreadSummary;
  latestActivity?: LatestActivity;
  unreadCount: number;
  chatOpenState: ChatOpenState;
  /** 활성 QuickCallRequest 존재 여부 (클라이언트에서 주입) */
  hasActiveQuickCall?: boolean;
}

const CHAT_OPEN_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getChatOpenState(
  summary: ThreadSummary,
  now: Date = new Date()
): ChatOpenState {
  const nowMs = now.getTime();

  // 트리거 2: 조율 채팅이 open 상태
  if (summary.schedulingChat?.status === "open") return "open";

  // 트리거 3: 최근 통화/만남 종료 후 24h 여운
  const lastEnded = summary.latestMeet?.endedAt;
  if (lastEnded) {
    const e = new Date(lastEnded).getTime();
    if (nowMs - e <= CHAT_OPEN_WINDOW_MS) return "open";
  }

  // upcoming booking (확정된 예약) 시각 ± 24h 도 open (여성 뷰에서 조율 확정 후 대비)
  const scheduled = summary.upcomingBooking?.scheduledAt;
  if (scheduled) {
    const s = new Date(scheduled).getTime();
    if (nowMs >= s - CHAT_OPEN_WINDOW_MS && nowMs <= s + CHAT_OPEN_WINDOW_MS) {
      return "open";
    }
  }

  // 히스토리 있으면 read_only, 아무 활동도 없으면 locked (신규 스레드)
  const hasHistory =
    summary.completedMeets.length > 0 || Boolean(summary.schedulingChat);
  return hasHistory ? "read_only" : "locked";
}

/**
 * 클라이언트에서 localStorage 트리거들과 합쳐 최종 chatOpenState 계산.
 * userThreadStore 를 여기서 import 하면 SSR 에서 window 접근이 문제되지 않도록 함수만 넘김.
 */
export function computeClientChatOpenState(
  baselineState: ChatOpenState,
  hasActiveQuickCall: boolean,
  hasClientAppointmentOpen: boolean,
  clientLastCallEndedAt: string | null,
  now: Date = new Date()
): ChatOpenState {
  if (baselineState === "open") return "open";
  if (hasActiveQuickCall) return "open";
  if (hasClientAppointmentOpen) return "open";
  if (clientLastCallEndedAt) {
    const diff = now.getTime() - new Date(clientLastCallEndedAt).getTime();
    if (diff <= CHAT_OPEN_WINDOW_MS) return "open";
  }
  return baselineState; // read_only 또는 locked
}

function pickLatestActivity(
  summary: ThreadSummary,
  viewer: "user" | "creator"
): LatestActivity | undefined {
  const candidates: LatestActivity[] = [];

  // 1) 조율 채팅 마지막 메시지
  if (summary.schedulingChat) {
    const msgs = chatMessagesMock
      .filter((m) => m.chatId === summary.schedulingChat!.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const last = msgs[0];
    if (last) {
      candidates.push({
        kind: last.senderType === "system" ? "system" : "message",
        preview: last.body,
        at: last.createdAt,
        senderIsMe:
          (viewer === "user" && last.senderType === "user") ||
          (viewer === "creator" && last.senderType === "creator"),
      });
    }
  }

  // 2) 최근 피드백 (사이다 친구가 남긴 것)
  if (summary.latestMeet?.feedbackSummary && summary.latestMeet.endedAt) {
    candidates.push({
      kind: "feedback",
      preview: `사이다 친구 피드백: ${summary.latestMeet.feedbackSummary}`,
      at: summary.latestMeet.endedAt,
      senderIsMe: viewer === "creator",
    });
  }

  // 3) 시스템 이벤트 — 예약 확정 / 애프터 신청 도착 / 회차 종료
  if (
    summary.upcomingBooking?.confirmedAt &&
    summary.upcomingBooking.scheduledAt
  ) {
    candidates.push({
      kind: "system",
      preview: "회차 예약 확정",
      at: summary.upcomingBooking.confirmedAt,
      senderIsMe: false,
    });
  }
  if (summary.schedulingRequest) {
    candidates.push({
      kind: "system",
      preview:
        viewer === "creator" ? "다음 애프터 신청 도착" : "다음 애프터 신청 보냄",
      at: summary.schedulingRequest.createdAt,
      senderIsMe: viewer === "user",
    });
  }

  if (candidates.length === 0) return undefined;
  return candidates.sort((a, b) => (a.at < b.at ? 1 : -1))[0];
}

/** 뷰어의 lastSeenAt 기반 unread — mock 에는 lastSeenAt 없으므로 임시로
 *  "상대가 보낸 최신 메시지가 아직 우리 쪽에서 열람 안 됐다" 가정. */
function computeUnread(
  summary: ThreadSummary,
  viewer: "user" | "creator"
): number {
  if (!summary.schedulingChat) return 0;
  const msgs = chatMessagesMock.filter(
    (m) => m.chatId === summary.schedulingChat!.id
  );
  return msgs.filter((m) => {
    if (m.senderType === "system") return false;
    if (viewer === "user") return m.senderType === "creator";
    return m.senderType === "user";
  }).length > 0
    ? // 데모 목적: 조율중 chat 이면 1개 unread 로 표시
      1
    : 0;
}

function buildListItem(
  summary: ThreadSummary,
  viewer: "user" | "creator"
): ThreadListItem {
  return {
    summary,
    latestActivity: pickLatestActivity(summary, viewer),
    unreadCount: computeUnread(summary, viewer),
    chatOpenState: getChatOpenState(summary),
  };
}

export function getUserThreadListItems(userId = CURRENT_USER_ID): ThreadListItem[] {
  return getUserThreadSummaries(userId).map((s) => buildListItem(s, "user"));
}

export function getCreatorThreadListItems(creatorId: string): ThreadListItem[] {
  return getCreatorThreadSummaries(creatorId).map((s) =>
    buildListItem(s, "creator")
  );
}

export function getThreadListItem(
  threadId: string,
  viewer: "user" | "creator"
): ThreadListItem | undefined {
  const s = getThreadSummaryById(threadId);
  if (!s) return undefined;
  return buildListItem(s, viewer);
}

/* ========================================================================
 *  User 가 /dating 에서 "채팅 걸기" 로 만든 상시 채팅방 (localStorage) 을
 *  ThreadListItem 으로 변환. mock 스레드가 없으므로 회차 0회, latestActivity 없음.
 * ==================================================================== */

/** 가상 ThreadSummary. mock 스레드가 없는 채팅방을 위한 최소 뼈대. */
export function buildVirtualSummary(
  creator: CreatorMock,
  threadId: string,
  createdAt: string
): ThreadSummary {
  return {
    thread: {
      id: threadId,
      userId: CURRENT_USER_ID,
      creatorId: creator.id,
      status: "active",
      voiceCount: 0,
      offlineCount: 0,
      createdAt,
    },
    creator,
    totalMeetCount: 0,
    completedMeets: [],
    latestMeet: undefined,
    schedulingRequest: undefined,
    schedulingChat: undefined,
    upcomingMeet: undefined,
    upcomingBooking: undefined,
    statusLabel: { kind: "ready_for_after", text: "지금 대화 중" },
  };
}

/** t_chat_<creatorId> 패턴이면 가상 ThreadListItem 만들어서 반환. */
export function buildVirtualListItem(
  creatorId: string,
  threadId: string,
  createdAt: string,
  latestPreview?: string,
  latestAt?: string
): ThreadListItem | undefined {
  const creator = creatorsMock.find((c) => c.id === creatorId);
  if (!creator) return undefined;
  const summary = buildVirtualSummary(creator, threadId, createdAt);
  return {
    summary,
    latestActivity: latestPreview
      ? {
          kind: "message",
          preview: latestPreview,
          at: latestAt ?? createdAt,
          senderIsMe: false,
        }
      : undefined,
    unreadCount: 0,
    chatOpenState: "open", // 유저가 스스로 연 방은 항상 open
  };
}
