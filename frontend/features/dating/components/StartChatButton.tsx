"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Calendar } from "lucide-react";
import {
  addChatThread,
  currentUserId,
  requestMeet,
  requestQuickCall,
  seedGreetingIfEmpty,
  threadIdForCreator,
  appendMessage,
} from "@/features/mypage/lib/userThreadStore";
import { cn } from "@/shared/lib/cn";

interface Props {
  creatorId: string;
  creatorNickname: string;
}

/**
 * `/dating` 친구 카드 우측 하단에 붙는 글라스모피즘 버튼.
 * 클릭 시 팝오버(액션 시트) 열림 — "지금 통화 요청" 또는 "약속잡기".
 *
 * 카드 자체가 Link 라서 e.preventDefault + stopPropagation 으로 라우팅 방지.
 */
export function StartChatButton({ creatorId, creatorNickname }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const openThreadAndGo = useCallback(() => {
    addChatThread(creatorId);
    const tid = threadIdForCreator(creatorId);
    seedGreetingIfEmpty(tid, creatorNickname);
    return tid;
  }, [creatorId, creatorNickname]);

  const onRequestCall = (e: React.MouseEvent) => {
    stop(e);
    const tid = openThreadAndGo();
    requestQuickCall(tid, currentUserId());
    appendMessage(tid, {
      senderId: "system",
      senderRole: "system",
      body: `⚡ ${creatorNickname}에게 "지금 통화 되냐?" 요청 보냈어. 30분 안에 답 없으면 자동 취소돼.`,
    });
    router.push(`/mypage/threads?thread=${tid}`);
  };

  const onRequestMeet = (e: React.MouseEvent) => {
    stop(e);
    const tid = openThreadAndGo();
    requestMeet(tid, currentUserId());
    appendMessage(tid, {
      senderId: "system",
      senderRole: "system",
      body: `🤝 ${creatorNickname}에게 만남 요청 보냈어. 여기서 시간이랑 장소 얘기해보자. (+ 버튼 → 약속잡기로 확정)`,
    });
    router.push(`/mypage/threads?thread=${tid}`);
  };

  return (
    <div ref={wrapRef} className="start-chat-btn-wrap">
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          setOpen((v) => !v);
        }}
        className={cn(
          "start-chat-btn",
          open && "start-chat-btn--open"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${creatorNickname}에게 액션 열기`}
      >
        <ChatGlassIcon size={26} />
      </button>

      {open && (
        <div className="start-chat-sheet" role="menu" onClick={stop}>
          <button
            type="button"
            className="start-chat-sheet__item"
            onClick={onRequestCall}
            role="menuitem"
          >
            <span className="start-chat-sheet__icon start-chat-sheet__icon--call">
              <Phone size={20} />
            </span>
            <span className="start-chat-sheet__label">지금 통화 요청</span>
            <span className="start-chat-sheet__sub">30분 안에 답 필요</span>
          </button>
          <button
            type="button"
            className="start-chat-sheet__item"
            onClick={onRequestMeet}
            role="menuitem"
          >
            <span className="start-chat-sheet__icon start-chat-sheet__icon--appt">
              <Calendar size={20} />
            </span>
            <span className="start-chat-sheet__label">만남 요청</span>
            <span className="start-chat-sheet__sub">채팅에서 24h 조율</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** 채팅 글라스 아이콘 — MypageIcons 톤. */
function ChatGlassIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sc-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="sc-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="sc-shine" cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M8 14 Q8 8 14 8 L34 8 Q40 8 40 14 L40 26 Q40 32 34 32 L22 32 L14 40 L14 32 Q8 32 8 26 Z"
        fill="url(#sc-back)"
      />
      <path
        d="M14 18 Q14 14 18 14 L34 14 Q38 14 38 18 L38 26 Q38 30 34 30 L24 30 L18 34 L18 30 Q14 30 14 26 Z"
        fill="url(#sc-front)"
      />
      <circle cx="21" cy="22" r="1.4" fill="#ffffff" opacity="0.95" />
      <circle cx="26" cy="22" r="1.4" fill="#ffffff" opacity="0.95" />
      <circle cx="31" cy="22" r="1.4" fill="#ffffff" opacity="0.95" />
      <ellipse cx="18" cy="12" rx="6" ry="2" fill="url(#sc-shine)" />
    </svg>
  );
}
