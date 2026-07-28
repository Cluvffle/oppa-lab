import Link from "next/link";
import { Avatar } from "@/shared/ui/Avatar";
import { Badge } from "@/shared/ui/Badge";
import { formatRelationship } from "@/shared/lib/mock";
import type { ThreadSummary } from "@/features/mypage/lib/selectors";
import { formatMeetDateTime, meetTierText } from "@/features/mypage/lib/format";
import { TierBadge } from "./TierBadge";

interface ThreadCardProps {
  s: ThreadSummary;
  /** "user" = 남성 유저 관점, "creator" = 사이다 친구 관점 */
  viewer: "user" | "creator";
}

/**
 * 남/여 공용 스레드 카드.
 * viewer=user: 사이다 친구 정보 상단 (누구랑 소개팅 중인지)
 * viewer=creator: 남성 익명 정보 상단 (누구를 봐주고 있는지)
 */
export function ThreadCard({ s, viewer }: ThreadCardProps) {
  return (
    <Link href={`/mypage/threads/${s.thread.id}`} className="thread-card">
      <div className="thread-card__head">
        {viewer === "user" ? (
          <>
            <Avatar
              src={s.creator.avatar}
              size="lg"
              ring={s.creator.isOnline}
              alt={s.creator.nickname}
            />
            <div className="thread-card__head-info">
              <div className="thread-card__nickname-row">
                <span className="thread-card__nickname">{s.creator.nickname}</span>
                {s.creator.isOnline && <Badge variant="online">ON</Badge>}
              </div>
              <div className="thread-card__meta">
                <span>{s.creator.age}</span>
                <span className="thread-card__dot">·</span>
                <span>{s.creator.mbti}</span>
                <span className="thread-card__dot">·</span>
                <span>{formatRelationship(s.creator.relationship)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="thread-card__anon-head">
            {/* 고구마 오빠 = 고구마 마스코트 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatars/sweet-potato.png"
              alt="고구마 오빠"
              className="thread-card__anon-avatar"
            />
            <div className="thread-card__head-info">
              <div className="thread-card__nickname-row">
                <span className="thread-card__nickname">고구마 오빠</span>
                <Badge variant="default">성장기</Badge>
              </div>
              <div className="thread-card__meta">
                <span>회차 {s.totalMeetCount}번째</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <MeetStepper s={s} />

      <StatusRow s={s} viewer={viewer} />

      {s.latestMeet?.feedbackSummary && viewer === "user" && (
        <p className="thread-card__feedback">
          <span className="thread-card__feedback-label">최근 피드백</span>
          &ldquo;{s.latestMeet.feedbackSummary}&rdquo;
        </p>
      )}
      {viewer === "creator" && s.completedMeets.length > 0 && (
        <p className="thread-card__feedback">
          <span className="thread-card__feedback-label">가장 최근 회차</span>
          {meetTierText(s.completedMeets[0].tier)} · 회차 {s.completedMeets[0].meetNumber}
        </p>
      )}
    </Link>
  );
}

/** 회차 카운트 — 티어별 총 횟수를 뱃지로. 예정/조율중은 별도 pill. */
function MeetStepper({ s }: { s: ThreadSummary }) {
  const voice = s.thread.voiceCount;
  const offline = s.thread.offlineCount;
  const total = voice + offline;

  return (
    <div className="thread-card__stepper">
      {total === 0 ? (
        <span className="thread-card__stepper-empty">아직 회차 없음</span>
      ) : (
        <>
          {voice > 0 && <TierBadge tier="voice" count={voice} />}
          {offline > 0 && <TierBadge tier="offline" count={offline} />}
        </>
      )}
      {s.upcomingMeet && (
        <span
          className="thread-card__step-pill thread-card__step-pill--upcoming"
          title="예약 확정"
        >
          <TierBadge tier={s.upcomingMeet.tier} iconOnly />
          예정
        </span>
      )}
      {s.schedulingRequest && (
        <span
          className="thread-card__step-pill thread-card__step-pill--pending"
          title="시간 조율 중"
        >
          <TierBadge tier={s.schedulingRequest.requestedTier} iconOnly />
          조율중
        </span>
      )}
    </div>
  );
}

function StatusRow({ s, viewer }: { s: ThreadSummary; viewer: "user" | "creator" }) {
  const l = s.statusLabel;
  if (l.kind === "upcoming") {
    return (
      <div className="thread-card__status thread-card__status--upcoming">
        <TierBadge tier={l.tier} />
        <span className="thread-card__status-text">
          {formatMeetDateTime(l.when)}
          {l.location ? ` · ${l.location}` : ""}
        </span>
      </div>
    );
  }
  if (l.kind === "scheduling") {
    return (
      <div className="thread-card__status thread-card__status--scheduling">
        <span className="thread-card__status-dot" />
        <span>{viewer === "creator" ? "조율 채팅 응답 필요" : "시간 조율 중"}</span>
      </div>
    );
  }
  if (l.kind === "awaiting_feedback") {
    return (
      <div className="thread-card__status thread-card__status--warn">
        <span className="thread-card__status-dot" />
        <span>{viewer === "creator" ? "피드백 작성 필요" : "피드백 대기 중"}</span>
      </div>
    );
  }
  if (l.kind === "ready_for_after") {
    return (
      <div className="thread-card__status thread-card__status--ready">
        <span className="thread-card__status-dot" />
        <span>{viewer === "creator" ? "다음 신청 대기" : "다음 애프터 신청 가능"}</span>
      </div>
    );
  }
  return (
    <div className="thread-card__status thread-card__status--paused">
      <span className="thread-card__status-dot" />
      <span>{l.text}</span>
    </div>
  );
}
