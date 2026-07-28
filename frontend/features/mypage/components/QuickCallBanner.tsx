"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import {
  acceptQuickCall,
  declineQuickCall,
  getActiveQuickCall,
  subscribeChatChanged,
  type QuickCallRequest,
} from "@/features/mypage/lib/userThreadStore";

interface Props {
  threadId: string;
  viewer: "user" | "creator";
  /** 통화방 라우팅용 (viewer=creator 는 ?role=creator) */
  callHref: string;
}

/**
 * "지금 통화 요청" 상단 배너 + 남은 시간 카운트다운.
 * - 오빠 뷰: "사이다 친구가 30분 안에 답할거야" + 취소 버튼
 * - 여성 뷰: "오빠가 지금 통화 되냐고 물어봤어" + 수락/거절
 * - 수락 후: 양쪽 다 "통화방 들어가기" 버튼
 * 만료되거나 없으면 null.
 */
export function QuickCallBanner({ threadId, viewer, callHref }: Props) {
  const router = useRouter();
  const [qc, setQc] = useState<QuickCallRequest | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const refresh = () => setQc(getActiveQuickCall(threadId));
    refresh();
    const unsub = subscribeChatChanged(({ threadId: t }) => {
      if (!t || t === threadId) refresh();
    });
    // 1초마다 카운트다운 tick
    const tick = window.setInterval(() => {
      setNow(Date.now());
      refresh();
    }, 1000);
    return () => {
      unsub();
      window.clearInterval(tick);
    };
  }, [threadId]);

  if (!qc) return null;

  const remainingMs = new Date(qc.expiresAt).getTime() - now;
  const remainingMin = Math.max(0, Math.floor(remainingMs / 60000));
  const remainingSec = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  if (qc.status === "accepted") {
    return (
      <div className="quickcall-banner quickcall-banner--accepted">
        <div className="quickcall-banner__body">
          <Phone size={18} />
          <span className="quickcall-banner__title">통화 수락됨</span>
          <span className="quickcall-banner__hint">지금 통화방으로 가자</span>
        </div>
        <button
          type="button"
          className="quickcall-banner__btn quickcall-banner__btn--primary"
          onClick={() => router.push(callHref)}
        >
          통화방 들어가기
        </button>
      </div>
    );
  }

  // pending
  return (
    <div className="quickcall-banner quickcall-banner--pending">
      <div className="quickcall-banner__body">
        <Phone size={18} />
        <span className="quickcall-banner__title">
          {viewer === "creator"
            ? "오빠가 지금 통화 되냐고 물어봤어"
            : "지금 통화 요청 보냄"}
        </span>
        <span className="quickcall-banner__hint">
          {remainingMin > 0
            ? `남은 시간 ${remainingMin}분`
            : `${remainingSec}초 남음`}
        </span>
      </div>
      {viewer === "creator" ? (
        <div className="quickcall-banner__actions">
          <button
            type="button"
            className="quickcall-banner__btn quickcall-banner__btn--ghost"
            onClick={() => declineQuickCall(threadId)}
          >
            지금 안 돼
          </button>
          <button
            type="button"
            className="quickcall-banner__btn quickcall-banner__btn--primary"
            onClick={() => {
              acceptQuickCall(threadId);
              router.push(callHref);
            }}
          >
            수락 · 통화 시작
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="quickcall-banner__btn quickcall-banner__btn--ghost"
          onClick={() => declineQuickCall(threadId)}
        >
          요청 취소
        </button>
      )}
    </div>
  );
}
