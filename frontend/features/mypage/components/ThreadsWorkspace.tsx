"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChatList } from "./ChatList";
import { ChatView } from "./ChatView";
import {
  buildVirtualListItem,
  computeClientChatOpenState,
  type ThreadListItem,
} from "@/features/mypage/lib/selectors";
import {
  getActiveMeetRequest,
  getActiveQuickCall,
  getLastCallEndedAt,
  getUpcomingAppointment,
  listMessages,
  listUserThreads,
  subscribeChatChanged,
} from "@/features/mypage/lib/userThreadStore";

interface Props {
  /** SSR 에서 넘어온 mock 기반 리스트 (오빠 뷰: t1~t4 / 여성 뷰: 크리에이터의 스레드) */
  serverItems: ThreadListItem[];
  viewer: "user" | "creator";
}

/**
 * 2-pane 워크스페이스.
 *
 * 데스크톱(>= 900px): 좌 ChatList, 우 ChatView (?thread=<id>)
 * 모바일(< 900px): 리스트 or 채팅 중 하나만.
 *
 * 유저(오빠) 뷰에선 mock 스레드 + localStorage 상시 채팅방을 병합해 보여준다.
 * localStorage 는 클라이언트 전용이므로 mount 후 hydrate.
 */
export function ThreadsWorkspace({ serverItems, viewer }: Props) {
  const sp = useSearchParams();
  const pathname = usePathname() ?? "/mypage/threads";
  const activeId = sp?.get("thread") ?? undefined;

  const [userItems, setUserItems] = useState<ThreadListItem[]>([]);

  useEffect(() => {
    if (viewer !== "user") return;
    const load = () => {
      const records = listUserThreads();
      const items: ThreadListItem[] = [];
      for (const rec of records) {
        const msgs = listMessages(rec.threadId);
        const last = msgs[msgs.length - 1];
        const it = buildVirtualListItem(
          rec.creatorId,
          rec.threadId,
          rec.createdAt,
          last?.body,
          last?.createdAt
        );
        if (it) items.push(it);
      }
      setUserItems(items);
    };
    load();
    const unsub = subscribeChatChanged(load);
    return unsub;
  }, [viewer]);

  // localStorage 트리거 tick — 아래 items 병합 및 clientOpenState 재계산에 사용
  const [clientTick, setClientTick] = useState(0);
  useEffect(() => {
    const unsub = subscribeChatChanged(() => setClientTick((t) => t + 1));
    const timer = window.setInterval(() => setClientTick((t) => t + 1), 30_000);
    return () => {
      unsub();
      window.clearInterval(timer);
    };
  }, []);

  // mock + user 병합. hasActiveQuickCall 주입 · 최근 활동 시간순 정렬.
  // QuickCall 있는 스레드는 최상단에.
  const items = useMemo(() => {
    const mockIds = new Set(serverItems.map((i) => i.summary.thread.id));
    const merged: ThreadListItem[] = [
      ...serverItems,
      ...userItems.filter((u) => !mockIds.has(u.summary.thread.id)),
    ].map((it) => ({
      ...it,
      hasActiveQuickCall: Boolean(getActiveQuickCall(it.summary.thread.id)),
    }));
    return merged.sort((a, b) => {
      if (a.hasActiveQuickCall !== b.hasActiveQuickCall) {
        return a.hasActiveQuickCall ? -1 : 1;
      }
      const at = a.latestActivity?.at ?? a.summary.thread.createdAt;
      const bt = b.latestActivity?.at ?? b.summary.thread.createdAt;
      return at < bt ? 1 : -1;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverItems, userItems, clientTick]);

  const buildHref = (threadId: string) => {
    const next = new URLSearchParams(sp?.toString() ?? "");
    next.set("thread", threadId);
    return `${pathname}?${next.toString()}`;
  };

  // 3단 뎁스: 실시간(/dating) → 채팅 리스트 → 채팅
  // 채팅 뒤로가기는 언제나 리스트(?thread 제거).
  // 리스트 자체의 뒤로가기(→ /dating) 는 ChatList 헤더에서 처리.
  const backHref = useMemo(() => {
    const next = new URLSearchParams(sp?.toString() ?? "");
    next.delete("thread");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, sp]);

  const activeItem = activeId
    ? items.find((i) => i.summary.thread.id === activeId)
    : undefined;

  const callHref = activeItem
    ? `/call/${activeItem.summary.thread.id}${
        viewer === "creator" ? "?role=creator" : ""
      }`
    : "#";

  // localStorage 트리거들과 병합해 최종 openState 계산 (clientTick 재사용)
  const clientOpenState = useMemo(() => {
    if (!activeItem) return undefined;
    const tid = activeItem.summary.thread.id;
    // 만남 요청 활성 = upcoming appointment 없어도 채팅 24h open
    const meetRequestActive = Boolean(getActiveMeetRequest(tid));
    const apptActive = Boolean(getUpcomingAppointment(tid));
    return computeClientChatOpenState(
      activeItem.chatOpenState,
      Boolean(getActiveQuickCall(tid)),
      meetRequestActive || apptActive,
      getLastCallEndedAt(tid)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, clientTick]);

  return (
    <div
      className="threads-workspace"
      data-view={activeItem ? "chat" : "list"}
    >
      <aside className="threads-workspace__list">
        <ChatList
          items={items}
          viewer={viewer}
          activeThreadId={activeId}
          buildHref={buildHref}
        />
      </aside>
      <section className="threads-workspace__pane">
        {activeItem ? (
          <ChatView
            item={activeItem}
            viewer={viewer}
            backHref={backHref}
            clientOpenState={clientOpenState}
            callHref={callHref}
          />
        ) : (
          <div className="threads-workspace__placeholder">
            <div className="threads-workspace__placeholder-icon" aria-hidden>
              💬
            </div>
            <p className="threads-workspace__placeholder-text">
              왼쪽에서 대화를 골라봐.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
