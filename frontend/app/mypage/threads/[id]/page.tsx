import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/shared/ui/Avatar";
import { Badge } from "@/shared/ui/Badge";
import { MeetTimeline } from "@/features/mypage/components/MeetTimeline";
import { AfterRequestPanel } from "@/features/mypage/components/AfterRequestPanel";
import { CoordinationChatView } from "@/features/mypage/components/CoordinationChatView";
import { readRoleFromSearchParams } from "@/features/mypage/lib/role";
import {
  getChatWithMessages,
  getMeetsByThread,
  getThreadSummaryById,
} from "@/features/mypage/lib/selectors";
import { bookingsMock, formatRelationship } from "@/shared/lib/mock";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ThreadDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const role = readRoleFromSearchParams(sp);

  const summary = getThreadSummaryById(id);
  if (!summary) return notFound();

  const meets = getMeetsByThread(id);
  const bookingsByMeet: Record<string, (typeof bookingsMock)[number] | undefined> = {};
  meets.forEach((m) => {
    bookingsByMeet[m.id] = bookingsMock.find((b) => b.meetId === m.id);
  });

  const activeChat = summary.schedulingChat;
  const chatWithMessages = activeChat ? getChatWithMessages(activeChat.id) : undefined;

  const locked = Boolean(summary.schedulingRequest || summary.upcomingMeet);
  const lockedReason = summary.upcomingMeet
    ? "이번 예약된 회차 마치고 신청할 수 있어."
    : summary.schedulingRequest
      ? "지금 조율 중인 신청이 있어. 시간 확정하고 다시 눌러."
      : undefined;

  const callHref = `/call/${id}${role === "creator" ? "?role=creator" : ""}`;

  return (
    <>
      <div className="thread-detail__topbar">
        <Link
          href={`/mypage/threads${role === "creator" ? "?role=creator" : ""}`}
          className="thread-detail__back"
        >
          ← 내 소개팅
        </Link>
        <Link href={callHref} className="thread-detail__call-btn">
          🎧 지금 목소리로
        </Link>
      </div>

          {/* 상대 헤더 (남/여 뷰 분기) */}
          {role === "user" ? (
            <section className="thread-detail__partner">
              <Avatar
                src={summary.creator.avatar}
                size="xl"
                ring={summary.creator.isOnline}
                alt={summary.creator.nickname}
              />
              <div className="thread-detail__partner-info">
                <div className="thread-detail__partner-nickname-row">
                  <h1 className="thread-detail__partner-nickname">
                    {summary.creator.nickname}
                  </h1>
                  {summary.creator.isOnline && (
                    <Badge variant="online">ON</Badge>
                  )}
                  <Badge variant="accent">
                    {formatRelationship(summary.creator.relationship)}
                  </Badge>
                </div>
                <p className="thread-detail__partner-meta">
                  {summary.creator.age}세 · {summary.creator.mbti} ·{" "}
                  {summary.creator.occupation}
                </p>
                <p className="thread-detail__partner-bio">
                  &ldquo;{summary.creator.bio}&rdquo;
                </p>
                <div className="thread-detail__partner-counts">
                  <span>총 회차 {summary.totalMeetCount}번</span>
                  <span>·</span>
                  <span>📞 {summary.thread.voiceCount}</span>
                  <span>📹 {summary.thread.videoCount}</span>
                  <span>🤝 {summary.thread.offlineCount}</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="thread-detail__partner thread-detail__partner--anon">
              <div className="thread-detail__anon-avatar">🙂</div>
              <div className="thread-detail__partner-info">
                <div className="thread-detail__partner-nickname-row">
                  <h1 className="thread-detail__partner-nickname">
                    익명 오빠
                  </h1>
                  <Badge variant="accent">성장기 · Lv.2</Badge>
                </div>
                <p className="thread-detail__partner-meta">
                  회차 {summary.totalMeetCount}번째 · 마케팅 관련직
                </p>
                <p className="thread-detail__partner-bio thread-detail__partner-bio--muted">
                  익명 정책상 실명·연락처는 안 보여. 대화에서 얻은 힌트만 볼 수 있어.
                </p>
              </div>
              <div className="thread-detail__creator-actions">
                <button
                  type="button"
                  className="thread-detail__report-btn"
                  title="집착 · 성적 발언 · 앱 외부 연락 요구 시"
                >
                  🚨 신고 · 차단
                </button>
              </div>
            </section>
          )}

          {/* 회차 타임라인 */}
          <section className="thread-detail__section">
            <h2 className="thread-detail__section-title">회차 히스토리</h2>
            <MeetTimeline
              meets={meets}
              bookingsByMeet={bookingsByMeet}
              viewer={role}
            />
          </section>

          {/* 조율 채팅 (있으면) */}
          {chatWithMessages && (
            <CoordinationChatView
              chat={chatWithMessages.chat}
              messages={chatWithMessages.messages}
              creator={summary.creator}
              viewer={role}
            />
          )}

          {/* 다음 애프터 신청 — 남성 뷰에만 노출. 여성은 "다음 신청 대기" 안내만. */}
          {role === "user" ? (
            <AfterRequestPanel
              creator={summary.creator}
              locked={locked}
              lockedReason={lockedReason}
            />
          ) : (
            <section className="after-panel after-panel--info">
              <div className="after-panel__head">
                <h3 className="after-panel__title">다음 회차</h3>
                <p className="after-panel__sub">
                  {summary.schedulingRequest
                    ? "오빠가 신청했어. 조율 채팅에서 시간 답해줘."
                    : summary.upcomingMeet
                      ? "이번 회차 마치면 오빠가 다음 애프터 신청할 수 있어."
                      : "다음 신청 기다리는 중. 무리하지 말고."}
                </p>
              </div>
            </section>
      )}
    </>
  );
}
