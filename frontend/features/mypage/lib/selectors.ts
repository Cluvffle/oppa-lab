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
    totalMeetCount: thread.voiceCount + thread.videoCount + thread.offlineCount,
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
