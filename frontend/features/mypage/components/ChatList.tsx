"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatListItem } from "./ChatListItem";
import type { ThreadListItem } from "@/features/mypage/lib/selectors";

interface Props {
  items: ThreadListItem[];
  viewer: "user" | "creator";
  /** 지금 선택된 스레드 id (2-pane 데스크톱에서 하이라이트) */
  activeThreadId?: string;
  /** 아이템 링크 href 생성기. 라우팅 전략에 따라 부모가 결정. */
  buildHref: (threadId: string) => string;
}

/**
 * 카톡 스타일 채팅 리스트 컨테이너. 필터 없이 그냥 시간순.
 * 오빠 뷰의 리스트 상단에서 뒤로가기 = /dating (실시간 친구 목록).
 */
export function ChatList({ items, viewer, activeThreadId, buildHref }: Props) {
  return (
    <div className="chat-list">
      <header className="chat-list__head">
        {viewer === "user" && (
          <Link
            href="/dating"
            className="chat-list__back"
            aria-label="실시간 친구 목록으로"
          >
            <ArrowLeft size={20} />
          </Link>
        )}
        <h1 className="chat-list__title">채팅</h1>
      </header>
      {items.length === 0 ? (
        <div className="chat-list__empty">
          {viewer === "creator"
            ? "아직 말 걸어온 오빠 없어."
            : "아직 대화 없어. 실시간 친구목록에서 채팅 걸어봐."}
        </div>
      ) : (
        <ul className="chat-list__ul">
          {items.map((item) => (
            <li key={item.summary.thread.id}>
              <ChatListItem
                item={item}
                viewer={viewer}
                active={item.summary.thread.id === activeThreadId}
                href={buildHref(item.summary.thread.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
