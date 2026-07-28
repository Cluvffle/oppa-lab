import { Badge } from "@/shared/ui/Badge";
import type { DatingMeetMock, BookingMock } from "@/shared/lib/mock";
import { formatMeetDateTime } from "@/features/mypage/lib/format";
import { TierBadge } from "./TierBadge";

interface MeetTimelineProps {
  meets: DatingMeetMock[];
  bookingsByMeet: Record<string, BookingMock | undefined>;
  viewer: "user" | "creator";
}

/**
 * 회차 타임라인 — 오래된 회차 → 최신 → 예정된 회차 순서.
 * user 뷰: 사이다 친구 피드백을 성장 자료로 표시
 * creator 뷰: 피드백 미작성이면 CTA 노출
 */
export function MeetTimeline({ meets, bookingsByMeet, viewer }: MeetTimelineProps) {
  if (meets.length === 0) {
    return (
      <div className="meet-timeline meet-timeline--empty">
        아직 회차가 없어. 첫 애프터를 시작해보자.
      </div>
    );
  }
  return (
    <ol className="meet-timeline">
      {meets.map((m) => {
        const b = bookingsByMeet[m.id];
        const isDone = m.status === "completed";
        const isScheduled = m.status === "scheduled";
        return (
          <li
            key={m.id}
            className={
              "meet-timeline__item " +
              (isDone
                ? "meet-timeline__item--done"
                : isScheduled
                  ? "meet-timeline__item--upcoming"
                  : "meet-timeline__item--other")
            }
          >
            <div className="meet-timeline__marker">
              <div className="meet-timeline__marker-dot" />
              <div className="meet-timeline__marker-line" />
            </div>

            <div className="meet-timeline__body">
              <div className="meet-timeline__head">
                <span className="meet-timeline__meet-number">
                  {m.meetNumber}회차
                </span>
                <TierBadge tier={m.tier} />

                {b?.scheduledAt && (
                  <span className="meet-timeline__when">
                    {formatMeetDateTime(b.scheduledAt)}
                  </span>
                )}
                {b?.location && (
                  <span className="meet-timeline__location">📍 {b.location}</span>
                )}
                <span className="meet-timeline__status-badge">
                  <MeetStatusBadge status={m.status} />
                </span>
              </div>

              {isDone && m.feedbackSummary && viewer === "user" && (
                <div className="meet-timeline__feedback">
                  <span className="meet-timeline__feedback-label">
                    사이다 친구 피드백
                  </span>
                  <p>&ldquo;{m.feedbackSummary}&rdquo;</p>
                </div>
              )}

              {isDone && viewer === "creator" && (
                <div className="meet-timeline__feedback-action">
                  {m.feedbackSummary ? (
                    <p className="meet-timeline__feedback-mine">
                      내가 남긴 피드백: &ldquo;{m.feedbackSummary}&rdquo;
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="meet-timeline__cta"
                    >
                      피드백 작성 →
                    </button>
                  )}
                </div>
              )}

              {isScheduled && (
                <p className="meet-timeline__hint">
                  예정된 회차야. 시간 지나면 자동 시작 알림이 갈 거야.
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function MeetStatusBadge({ status }: { status: DatingMeetMock["status"] }) {
  switch (status) {
    case "completed":
      return <Badge variant="online">완료</Badge>;
    case "scheduled":
      return <Badge variant="accent">예정</Badge>;
    case "in_progress":
      return <Badge variant="online">진행 중</Badge>;
    case "no_show":
      return <Badge>노쇼</Badge>;
    case "canceled":
      return <Badge>취소</Badge>;
  }
}
