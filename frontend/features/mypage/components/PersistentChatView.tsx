"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Phone, Calendar } from "lucide-react";
import {
  appendMessage,
  listMessages,
  requestQuickCall,
  subscribeChatChanged,
  currentUserId,
  type StoredMessage,
} from "@/features/mypage/lib/userThreadStore";
import type { CreatorMock } from "@/shared/lib/mock";
import type { ChatOpenState } from "@/features/mypage/lib/selectors";
import { QuickCallBanner } from "./QuickCallBanner";
import { cn } from "@/shared/lib/cn";

interface Props {
  threadId: string;
  creator: CreatorMock;
  viewer: "user" | "creator";
  /** 채팅 open 상태 — read_only 면 입력 비활성 */
  openState: ChatOpenState;
  /** 있으면 상단에 조율 배너 노출 */
  hasSchedulingChat?: boolean;
  onOpenScheduling?: () => void;
  /** 약속잡기 시트 클릭 → 부모가 AppointmentModal 열기 */
  onOpenAppointment?: () => void;
  /** QuickCall 수락 시 이동할 통화방 링크 */
  callHref: string;
}

const KOREAN_TIME_FMT = new Intl.DateTimeFormat("ko-KR", {
  hour: "numeric",
  minute: "2-digit",
});

const KOREAN_DATE_FMT = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function sameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

/**
 * 상시 채팅 뷰 (카톡 스타일).
 * - localStorage 기반 (userThreadStore)
 * - 카드 껍데기 없이 body 를 꽉 채움
 * - 좌: 상대(그레이 버블), 우: 나(액센트 버블)
 * - 시스템 메시지: 가운데 흐린 텍스트
 * - 날짜가 바뀌면 사이에 날짜 구분선
 */
export function PersistentChatView({
  threadId,
  creator,
  viewer,
  openState,
  hasSchedulingChat,
  onOpenScheduling,
  onOpenAppointment,
  callHref,
}: Props) {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  // 시트 외부 클릭/ESC 로 닫기
  useEffect(() => {
    if (!sheetOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!composerRef.current?.contains(e.target as Node)) setSheetOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const meId = currentUserId();

  useEffect(() => {
    const load = () => setMessages(listMessages(threadId));
    load();
    const unsub = subscribeChatChanged(({ threadId: t }) => {
      if (!t || t === threadId) load();
    });
    return unsub;
  }, [threadId]);

  // 새 메시지 오면 하단 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const grouped = useMemo(() => {
    const out: (StoredMessage | { kind: "date"; at: string })[] = [];
    let prev: StoredMessage | undefined;
    for (const m of messages) {
      if (!prev || !sameDay(prev.createdAt, m.createdAt)) {
        out.push({ kind: "date", at: m.createdAt });
      }
      out.push(m);
      prev = m;
    }
    return out;
  }, [messages]);

  const onSend = () => {
    const body = draft.trim();
    if (!body) return;
    appendMessage(threadId, {
      senderId: viewer === "user" ? meId : creator.id,
      senderRole: viewer,
      body,
    });
    setDraft("");
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 등 IME 조합 중에는 Enter 를 무시.
    // 조합 중 Enter 를 잡아버리면 마지막 글자가 중복 확정돼 두 번 전송됨.
    // - React SyntheticEvent 의 nativeEvent.isComposing 체크
    // - 사파리 대응으로 keyCode 229 도 함께 체크
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const native = e.nativeEvent as any;
    if (native?.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="persistent-chat">
      <QuickCallBanner threadId={threadId} viewer={viewer} callHref={callHref} />
      {hasSchedulingChat && (
        <button
          type="button"
          className="persistent-chat__scheduling-banner"
          onClick={onOpenScheduling}
        >
          <span>⚡ 지금 시간 조율 중이야</span>
          <span className="persistent-chat__scheduling-cta">조율 채팅 열기 →</span>
        </button>
      )}

      <div ref={scrollRef} className="persistent-chat__scroll">
        {grouped.length === 0 ? (
          <div className="persistent-chat__empty">
            아직 메시지 없어. 인사부터 건네보자.
          </div>
        ) : (
          grouped.map((item, i) =>
            "kind" in item ? (
              <div
                key={`d-${item.at}-${i}`}
                className="persistent-chat__date-sep"
              >
                {KOREAN_DATE_FMT.format(new Date(item.at))}
              </div>
            ) : (
              <MessageRow
                key={item.id}
                m={item}
                viewer={viewer}
                creatorNickname={creator.nickname}
              />
            )
          )
        )}
      </div>

      <div ref={composerRef} className="persistent-chat__composer">
        <div className="persistent-chat__plus-wrap">
          <button
            type="button"
            className={cn(
              "persistent-chat__plus",
              sheetOpen && "persistent-chat__plus--open"
            )}
            aria-label="추가 액션 열기"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen((v) => !v)}
          >
            <Plus size={20} />
          </button>
          {sheetOpen && (
            <div className="action-sheet" role="menu">
              <button
                type="button"
                className="action-sheet__item"
                role="menuitem"
                onClick={() => {
                  setSheetOpen(false);
                  requestQuickCall(threadId, currentUserId());
                  appendMessage(threadId, {
                    senderId: "system",
                    senderRole: "system",
                    body: `⚡ ${creator.nickname}에게 "지금 통화 되냐?" 요청 보냈어. 30분 안에 답 없으면 자동 취소돼.`,
                  });
                }}
              >
                <span className="action-sheet__icon action-sheet__icon--call">
                  <Phone size={22} />
                </span>
                <span className="action-sheet__label">지금 통화 요청</span>
              </button>
              <button
                type="button"
                className="action-sheet__item"
                onClick={() => {
                  setSheetOpen(false);
                  onOpenAppointment?.();
                }}
                role="menuitem"
              >
                <span className="action-sheet__icon action-sheet__icon--appt">
                  <Calendar size={22} />
                </span>
                <span className="action-sheet__label">약속잡기</span>
              </button>
            </div>
          )}
        </div>
        <textarea
          className="persistent-chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={
            openState === "open"
              ? "메시지 입력..."
              : "지금은 히스토리만. + 버튼으로 통화 요청/약속잡기 해봐."
          }
          rows={1}
          disabled={openState !== "open"}
        />
        <button
          type="button"
          onClick={onSend}
          className="persistent-chat__send"
          disabled={openState !== "open" || !draft.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
}

function MessageRow({
  m,
  viewer,
  creatorNickname,
}: {
  m: StoredMessage;
  viewer: "user" | "creator";
  creatorNickname: string;
}) {
  if (m.senderRole === "system") {
    return <div className="persistent-chat__system">{m.body}</div>;
  }
  const isMine = m.senderRole === viewer;
  const time = new Date(m.createdAt);
  return (
    <div
      className={cn(
        "persistent-chat__row",
        isMine
          ? "persistent-chat__row--mine"
          : "persistent-chat__row--theirs"
      )}
    >
      {!isMine && (
        <span className="persistent-chat__name">
          {viewer === "user" ? creatorNickname : "오빠"}
        </span>
      )}
      <div className="persistent-chat__row-line">
        {isMine && (
          <time className="persistent-chat__time" dateTime={m.createdAt}>
            {KOREAN_TIME_FMT.format(time)}
          </time>
        )}
        <div className="persistent-chat__bubble">{m.body}</div>
        {!isMine && (
          <time className="persistent-chat__time" dateTime={m.createdAt}>
            {KOREAN_TIME_FMT.format(time)}
          </time>
        )}
      </div>
    </div>
  );
}
