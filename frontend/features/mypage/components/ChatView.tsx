"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { Badge } from "@/shared/ui/Badge";
import { CoordinationChatView } from "./CoordinationChatView";
import { MeetTimeline } from "./MeetTimeline";
import { AfterRequestPanel } from "./AfterRequestPanel";
import { PersistentChatView } from "./PersistentChatView";
import { AppointmentModal } from "./AppointmentModal";
import {
  bookingsMock,
  formatRelationship,
  type DatingMeetMock,
} from "@/shared/lib/mock";
import type {
  ChatOpenState,
  ThreadListItem,
} from "@/features/mypage/lib/selectors";
import {
  getChatWithMessages,
  getMeetsByThread,
} from "@/features/mypage/lib/selectors";
import { cn } from "@/shared/lib/cn";

interface Props {
  item: ThreadListItem;
  viewer: "user" | "creator";
  /** 모바일 리스트로 돌아가는 링크 (표시 여부는 CSS 미디어로) */
  backHref: string;
  /** 클라이언트에서 재계산된 open 상태 (localStorage 트리거 반영) */
  clientOpenState?: ChatOpenState;
  /** QuickCall 수락 시 이동할 통화방 링크 */
  callHref: string;
}

type Tab = "chat" | "meets";

const TAB_META: { key: Tab; label: string }[] = [
  { key: "chat", label: "대화" },
  { key: "meets", label: "히스토리" },
];

/**
 * 우 pane 채팅 뷰. 상단 헤더 + 2탭 (대화 / 회차 히스토리).
 * - 대화: 상시 채팅(localStorage) + 조율 채팅이 있으면 상단 배너
 * - 회차: 타임라인 + AfterRequestPanel
 */
export function ChatView({
  item,
  viewer,
  backHref,
  clientOpenState,
  callHref,
}: Props) {
  const [tab, setTab] = useState<Tab>("chat");
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const { summary } = item;
  const { creator } = summary;
  const openState = clientOpenState ?? item.chatOpenState;

  // ?open=appointment 로 진입 시 자동으로 모달 열기 (한 번만)
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? "/mypage/threads";
  useEffect(() => {
    if (sp?.get("open") !== "appointment") return;
    setApptOpen(true);
    const next = new URLSearchParams(sp.toString());
    next.delete("open");
    router.replace(`${pathname}?${next.toString()}`);
    // 최초 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const peerName = viewer === "creator" ? "고구마 오빠" : creator.nickname;

  const meets = getMeetsByThread(summary.thread.id);
  const bookingsByMeet: Record<string, (typeof bookingsMock)[number] | undefined> = {};
  meets.forEach((m: DatingMeetMock) => {
    bookingsByMeet[m.id] = bookingsMock.find((b) => b.meetId === m.id);
  });

  const chatWithMessages = summary.schedulingChat
    ? getChatWithMessages(summary.schedulingChat.id)
    : undefined;

  const locked = Boolean(summary.schedulingRequest || summary.upcomingMeet);
  const lockedReason = summary.upcomingMeet
    ? "이번 예약된 회차 마치고 신청할 수 있어."
    : summary.schedulingRequest
      ? "지금 조율 중인 신청이 있어. 시간 확정하고 다시 눌러."
      : undefined;

  return (
    <section className="chat-view">
      <header className="chat-view__head">
        <Link href={backHref} className="chat-view__back" aria-label="목록으로">
          <ArrowLeft size={20} />
        </Link>
        {viewer === "creator" ? (
          // 고구마 오빠 = 고구마 마스코트
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/avatars/sweet-potato.png"
            alt="고구마 오빠"
            className="chat-view__anon-avatar"
          />
        ) : (
          <Avatar
            src={creator.avatar}
            size="md"
            ring={creator.isOnline}
            alt={peerName}
          />
        )}
        <div className="chat-view__ident">
          <span className="chat-view__name">{peerName}</span>
          {viewer === "user" && creator.isOnline && (
            <Badge variant="online">ON</Badge>
          )}
        </div>
        {viewer === "user" && (
          <Badge variant="accent" className="chat-view__persona">
            {formatRelationship(creator.relationship)}
          </Badge>
        )}
      </header>

      <nav className="chat-view__tabs" role="tablist">
        {TAB_META.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={cn(
              "chat-view__tab",
              tab === t.key && "chat-view__tab--active"
            )}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div
        className={cn(
          "chat-view__body",
          tab === "chat" && "chat-view__body--flush"
        )}
      >
        {tab === "chat" && (
          <PersistentChatView
            threadId={summary.thread.id}
            creator={creator}
            viewer={viewer}
            openState={openState}
            hasSchedulingChat={Boolean(chatWithMessages)}
            onOpenScheduling={() => setSchedulingOpen(true)}
            onOpenAppointment={() => setApptOpen(true)}
            callHref={callHref}
          />
        )}

        {tab === "meets" && (
          <div className="chat-view__meets">
            <MeetTimeline
              meets={meets}
              bookingsByMeet={bookingsByMeet}
              viewer={viewer}
            />
            {viewer === "user" ? (
              <AfterRequestPanel
                creator={creator}
                locked={locked}
                lockedReason={lockedReason}
              />
            ) : (
              <div className="after-panel after-panel--info">
                <h3 className="after-panel__title">다음 회차</h3>
                <p className="after-panel__sub">
                  {summary.schedulingRequest
                    ? "오빠가 신청했어. 조율 채팅에서 시간 답해줘."
                    : summary.upcomingMeet
                      ? "이번 회차 마치면 오빠가 다음 애프터 신청할 수 있어."
                      : "다음 신청 기다리는 중. 무리하지 말고."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 약속잡기 모달 */}
      {apptOpen && (
        <AppointmentModal
          threadId={summary.thread.id}
          creator={creator}
          onClose={() => setApptOpen(false)}
        />
      )}

      {/* 조율 채팅 모달 */}
      {schedulingOpen && chatWithMessages && (
        <div
          className="scheduling-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setSchedulingOpen(false)}
        >
          <div
            className="scheduling-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="scheduling-modal__head">
              <span className="scheduling-modal__title">조율 채팅</span>
              <button
                type="button"
                className="scheduling-modal__close"
                onClick={() => setSchedulingOpen(false)}
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
            <div className="scheduling-modal__body">
              <CoordinationChatView
                chat={chatWithMessages.chat}
                messages={chatWithMessages.messages}
                creator={creator}
                viewer={viewer}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

