"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import type {
  ChatMessageMock,
  CoordinationChatMock,
  CreatorMock,
} from "@/shared/lib/mock";
import { formatMeetDateTime, formatRelativeTime } from "@/features/mypage/lib/format";

interface Props {
  chat: CoordinationChatMock;
  messages: ChatMessageMock[];
  creator: CreatorMock;
  viewer: "user" | "creator";
}

/**
 * 조율 채팅 뷰.
 * - 시스템 메시지: 중앙 정렬 안내
 * - 유저/크리에이터: 좌우 버블
 * - proposal 이 있으면 시간/장소 카드 렌더
 * - has_redaction 이면 redactedBody 우선 노출 + 배지
 * - readonly / archived 면 입력창 비활성 + 안내
 */
export function CoordinationChatView({ chat, messages, creator, viewer }: Props) {
  const [draft, setDraft] = useState("");
  const readonly = chat.status !== "open";

  return (
    <section className="chat">
      <header className="chat__head">
        <div>
          <h3 className="chat__title">조율 채팅</h3>
          <p className="chat__sub">
            {viewer === "user"
              ? `${creator.nickname}랑 소개팅 시간 잡는 곳이야.`
              : "이 오빠랑 시간 잡는 곳이야."}
          </p>
        </div>
        <ChatStatusBadge chat={chat} />
      </header>

      <div className="chat__scroll">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            m={m}
            creatorNickname={creator.nickname}
            viewer={viewer}
          />
        ))}
      </div>

      <div className={cn("chat__composer", readonly && "chat__composer--readonly")}>
        {readonly ? (
          <p className="chat__composer-lock">
            {chat.status === "readonly"
              ? "예약이 확정되어 채팅이 잠겼어. 회차 완료 후 다음 애프터에서 다시 열려."
              : "이 채팅은 종료됐어."}
          </p>
        ) : (
          <>
            <textarea
              rows={2}
              placeholder="시간이나 장소를 제안해봐. 개인 연락처는 자동 마스킹돼."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="chat__composer-input"
            />
            <div className="chat__composer-actions">
              <button
                type="button"
                className="chat__composer-btn chat__composer-btn--secondary"
              >
                🕐 시간 제안
              </button>
              <button type="button" className="chat__composer-btn">
                보내기
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ChatStatusBadge({ chat }: { chat: CoordinationChatMock }) {
  if (chat.status === "open") {
    return <span className="chat__status chat__status--open">조율 중</span>;
  }
  if (chat.status === "readonly") {
    return <span className="chat__status chat__status--readonly">예약 확정</span>;
  }
  return <span className="chat__status chat__status--archived">종료</span>;
}

function MessageBubble({
  m,
  creatorNickname,
  viewer,
}: {
  m: ChatMessageMock;
  creatorNickname: string;
  viewer: "user" | "creator";
}) {
  if (m.senderType === "system") {
    return <div className="chat__system">{m.body}</div>;
  }
  // "self" = 이 화면을 보는 사람이 보낸 메시지
  const isSelf =
    (viewer === "user" && m.senderType === "user") ||
    (viewer === "creator" && m.senderType === "creator");
  const senderLabel =
    m.senderType === "user"
      ? viewer === "user"
        ? "나"
        : "오빠"
      : viewer === "creator"
        ? "나"
        : creatorNickname;

  const text = m.hasRedaction && m.redactedBody ? m.redactedBody : m.body;

  return (
    <div className={cn("chat__row", isSelf && "chat__row--self")}>
      <div className="chat__bubble-wrap">
        <div className="chat__bubble-meta">
          <span className="chat__bubble-sender">{senderLabel}</span>
          <span className="chat__bubble-time">
            {formatRelativeTime(m.createdAt)}
          </span>
        </div>
        <div
          className={cn(
            "chat__bubble",
            isSelf ? "chat__bubble--self" : "chat__bubble--other"
          )}
        >
          {text}
          {m.hasRedaction && (
            <span className="chat__redaction-badge" title="개인정보 자동 마스킹">
              🔒 마스킹됨
            </span>
          )}
        </div>
        {m.proposal && (
          <ProposalCard
            scheduledAt={m.proposal.scheduledAt}
            location={m.proposal.location}
            accepted={m.isProposalAccepted}
            isSelfSender={isSelf}
          />
        )}
      </div>
    </div>
  );
}

function ProposalCard({
  scheduledAt,
  location,
  accepted,
  isSelfSender,
}: {
  scheduledAt: string;
  location?: string;
  accepted?: boolean;
  isSelfSender: boolean;
}) {
  return (
    <div
      className={cn(
        "chat__proposal",
        accepted && "chat__proposal--accepted"
      )}
    >
      <div className="chat__proposal-head">
        <span className="chat__proposal-icon">🕐</span>
        <span className="chat__proposal-title">시간 제안</span>
      </div>
      <div className="chat__proposal-when">{formatMeetDateTime(scheduledAt)}</div>
      {location && <div className="chat__proposal-where">📍 {location}</div>}
      {accepted ? (
        <div className="chat__proposal-accepted">✅ 양측 확정 · 예약 완료</div>
      ) : isSelfSender ? (
        <div className="chat__proposal-waiting">상대 확정 대기 중</div>
      ) : (
        <div className="chat__proposal-actions">
          <button type="button" className="chat__proposal-btn">
            이 시간으로 확정
          </button>
          <button
            type="button"
            className="chat__proposal-btn chat__proposal-btn--secondary"
          >
            다른 시간 제안
          </button>
        </div>
      )}
    </div>
  );
}
