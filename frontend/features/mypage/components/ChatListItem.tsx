"use client";

import Link from "next/link";
import { Avatar } from "@/shared/ui/Avatar";
import { TierBadge } from "./TierBadge";
import { formatRelativeTime } from "@/features/mypage/lib/format";
import type { ThreadListItem } from "@/features/mypage/lib/selectors";
import { cn } from "@/shared/lib/cn";

interface Props {
  item: ThreadListItem;
  viewer: "user" | "creator";
  active: boolean;
  href: string;
}

/**
 * 카톡 스타일 채팅 리스트 한 줄.
 * - 오빠 뷰: 아바타 = 사이다 친구 프로필
 * - 여성 뷰: 아바타 = 고구마 오빠 이니셜 원
 */
export function ChatListItem({ item, viewer, active, href }: Props) {
  const { summary, latestActivity, unreadCount, chatOpenState } = item;

  const name =
    viewer === "creator" ? "고구마 오빠" : summary.creator.nickname;
  const timeText = latestActivity
    ? formatRelativeTime(latestActivity.at)
    : formatRelativeTime(summary.thread.lastMeetAt ?? summary.thread.createdAt);
  const preview =
    latestActivity?.preview ?? "아직 대화 없어. 통화 시작해서 시동 걸어보자.";

  const { voiceCount, offlineCount } = summary.thread;
  const total = voiceCount + offlineCount;

  return (
    <Link
      href={href}
      className={cn("chat-list-item", active && "chat-list-item--active")}
      aria-current={active ? "true" : undefined}
    >
      {viewer === "creator" ? (
        // 고구마 오빠 = 고구마 마스코트
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/avatars/sweet-potato.png"
          alt="고구마 오빠"
          className="chat-list-item__anon-avatar"
        />
      ) : (
        <Avatar
          src={summary.creator.avatar}
          size="md"
          ring={summary.creator.isOnline}
          alt={name}
        />
      )}

      <div className="chat-list-item__body">
        <div className="chat-list-item__row1">
          <span className="chat-list-item__name">{name}</span>
          {total > 0 && (
            <span className="chat-list-item__tiers">
              {voiceCount > 0 && (
                <TierBadge tier="voice" count={voiceCount} iconSize={11} />
              )}
              {offlineCount > 0 && (
                <TierBadge tier="offline" count={offlineCount} iconSize={11} />
              )}
            </span>
          )}
          <span className="chat-list-item__time">{timeText}</span>
        </div>

        <div className="chat-list-item__row2">
          <p className="chat-list-item__preview">{preview}</p>
          {item.hasActiveQuickCall && (
            <span className="chat-list-item__qc" aria-label="지금 통화 요청">
              📞 요청
            </span>
          )}
          {unreadCount > 0 && (
            <span
              className="chat-list-item__unread"
              aria-label={`안 읽음 ${unreadCount}건`}
            >
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
