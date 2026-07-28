import Link from "next/link";
import {
  charmActivityEmoji,
  charmActivityLabel,
  trainingPostsMock,
} from "@/shared/lib/mock";

/**
 * 홈 섹션 — 이번주 같이 놀 친구 (매력 트레이닝 대면 모집 프리뷰).
 * 오늘 기준 +6일 범위의 open 모집을 시간순 최대 6개.
 * 카드 클릭 → /coaching/post/{id}.
 *
 * 스킬: [[charm-training]]
 */
export function WeeklyTrainingSection() {
  // 서버 렌더 안전 — 오늘 자정 (KST) 기준
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(todayStart.getDate() + 7);

  const posts = trainingPostsMock
    .filter((p) => p.status === "open")
    .filter((p) => {
      const [datePart, timePart] = p.scheduledAt.split("T");
      const [y, m, d] = datePart.split("-").map(Number);
      const [hh, mm] = timePart.split(":").map(Number);
      const t = new Date(y, m - 1, d, hh, mm);
      return t >= todayStart && t < weekEnd;
    })
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, 6);

  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-title__emoji" aria-hidden>🎉</span>
              이번주 같이 놀 친구
            </h2>
            <p className="section-subtitle">
              대면으로 편하게 만날 수 있는 사이다 친구 모집
            </p>
          </div>
          <Link href="/coaching" className="section-link">
            매력 트레이닝 전체 →
          </Link>
        </div>

        <div className="weekly-training-grid">
          {posts.map((p) => {
            const { dayLabel, timeLabel } = formatScheduled(
              p.scheduledAt,
              todayStart
            );
            return (
              <Link
                key={p.id}
                href={`/coaching/post/${p.id}`}
                className="weekly-training-card"
              >
                <div className="weekly-training-card__head">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.authorAvatar}
                    alt={p.authorNickname}
                    className="weekly-training-card__avatar"
                  />
                  <div className="weekly-training-card__ident">
                    <div className="weekly-training-card__nickname">
                      {p.authorNickname}
                    </div>
                    {p.authorRelationship && (
                      <div className="weekly-training-card__relationship">
                        {p.authorRelationship}
                      </div>
                    )}
                  </div>
                </div>

                <div className="weekly-training-card__activity">
                  <span aria-hidden>{charmActivityEmoji[p.activity]}</span>
                  {charmActivityLabel[p.activity]}
                </div>
                <div className="weekly-training-card__when">
                  {dayLabel} · {timeLabel}
                </div>
                <div className="weekly-training-card__where">
                  📍 {p.location}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function formatScheduled(
  iso: string,
  todayStart: Date
): { dayLabel: string; timeLabel: string } {
  const [datePart, timePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const target = new Date(y, m - 1, d);
  const diffDays = Math.round(
    (target.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];
  let dayLabel: string;
  if (diffDays === 0) dayLabel = "오늘";
  else if (diffDays === 1) dayLabel = "내일";
  else dayLabel = `${m}/${d} (${weekLabels[target.getDay()]})`;

  const period = hh < 12 ? "오전" : "오후";
  const hh12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  const timeLabel = `${period} ${hh12}시${mm > 0 ? ` ${mm}분` : ""}`;
  return { dayLabel, timeLabel };
}
