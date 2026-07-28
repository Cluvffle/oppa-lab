"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { SingleSelectDropdown } from "@/shared/ui/SingleSelectDropdown";
import {
  charmActivityEmoji,
  charmActivityLabel,
  trainingPostsMock,
  trainingReviewsMock,
  type CharmActivityKind,
  type TrainingPostMock,
  type TrainingReviewMock,
} from "@/shared/lib/mock";

/**
 * 매력 트레이닝 진입 페이지.
 * 스킬: [[charm-training]] · [[mission]] · [[panel-persona]]
 *
 * 필터 (쿼리 기반):
 * - ?activity=wardrobe|photo|cafe|food|activity — 활동 (서브바)
 * - ?by=creator|user — 오픈한 사람 (리스트 상단 pill)
 * - ?day=YYYY-MM-DD — 날짜 (주간 캘린더)
 * - ?view=reviews — 후기 탭 (모집 대신 후기 카드)
 *
 * "나도 오픈" CTA 하단 sticky.
 */
export function CharmTrainingBoard() {
  const router = useRouter();
  const sp = useSearchParams();
  const activity = sp?.get("activity") as CharmActivityKind | null;
  const by = sp?.get("by") as "creator" | "user" | null;
  const view = sp?.get("view");
  const day = sp?.get("day"); // YYYY-MM-DD (주간 캘린더 클릭)

  const setBy = (next: "creator" | "user" | null) => {
    const parts: string[] = [];
    if (activity) parts.push(`activity=${activity}`);
    if (day) parts.push(`day=${day}`);
    if (next) parts.push(`by=${next}`);
    if (view) parts.push(`view=${view}`);
    const qs = parts.length > 0 ? `?${parts.join("&")}` : "";
    router.replace(`/coaching${qs}`, { scroll: false });
  };

  const isReviewsView = view === "reviews";

  const week = useMemo(() => buildWeekFromToday(), []);

  const posts = useMemo(() => {
    if (isReviewsView) return [];
    let list = trainingPostsMock.filter((p) => p.status === "open");
    if (activity) list = list.filter((p) => p.activity === activity);
    if (by) list = list.filter((p) => p.authorType === by);
    if (day) list = list.filter((p) => p.scheduledAt.startsWith(day));
    return list.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  }, [activity, by, day, isReviewsView]);

  const reviews = useMemo(() => {
    if (!isReviewsView) return [];
    let list = [...trainingReviewsMock];
    if (activity) list = list.filter((r) => r.activity === activity);
    return list;
  }, [isReviewsView, activity]);

  const title = isReviewsView
    ? "매력 트레이닝 후기"
    : activity
    ? `${charmActivityLabel[activity]} 모집`
    : "매력 트레이닝";
  const subtitle = isReviewsView
    ? "다녀온 오빠들의 감상 · 사이다 친구의 한 마디"
    : "사이다 친구랑 편하게 놀면서 매력 근육 키우자";

  return (
    <main className="charm-training">
      <div className="container">
        <header className="charm-training__head">
          <div className="charm-training__head-text">
            <h1 className="charm-training__title">{title}</h1>
            <p className="charm-training__sub">{subtitle}</p>
          </div>
          {!isReviewsView && (
            <div className="charm-training__head-filter">
              <SingleSelectDropdown<"creator" | "user">
                label="누가"
                value={by}
                onChange={setBy}
                compact
                options={[
                  { value: null, label: "모두" },
                  { value: "creator", label: "사이다 친구" },
                  { value: "user", label: "고구마 친구" },
                ]}
              />
            </div>
          )}
        </header>

        {!isReviewsView && (
          <WeekCalendar
            week={week}
            selected={day ?? null}
            queryPreserve={{ activity, by }}
          />
        )}

        {isReviewsView ? (
          reviews.length === 0 ? (
            <div className="charm-training__empty">아직 이 활동 후기 없어.</div>
          ) : (
            <ul className="charm-training__list">
              {reviews.map((r) => (
                <li key={r.id}>
                  <ReviewCard r={r} />
                </li>
              ))}
            </ul>
          )
        ) : posts.length === 0 ? (
          <div className="charm-training__empty">
            {day
              ? "이 날짜에 열린 모집이 없어. 다른 날짜 눌러보거나 직접 오픈해봐."
              : "이 필터로 열린 모집이 없어."}
          </div>
        ) : (
          <ul className="charm-training__list">
            {posts.map((p) => (
              <li key={p.id}>
                <PostCard p={p} />
              </li>
            ))}
          </ul>
        )}

        {!isReviewsView && (
          <Link href="/coaching/new" className="charm-training__cta">
            <Plus size={18} />
            나도 같이해줄 친구 구하기
          </Link>
        )}
      </div>
    </main>
  );
}

/* ─────────────────────────────  카드  ───────────────────────────── */

function PostCard({ p }: { p: TrainingPostMock }) {
  const { dayLabel, timeLabel } = formatScheduled(p.scheduledAt);
  return (
    <Link href={`/coaching/post/${p.id}`} className="training-card">
      <div className="training-card__author">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.authorAvatar} alt={p.authorNickname} className="training-card__avatar" />
        <div className="training-card__author-ident">
          <div className="training-card__nickname">{p.authorNickname}</div>
          {p.authorRelationship && (
            <div className="training-card__relationship">{p.authorRelationship}</div>
          )}
        </div>
      </div>

      <div className="training-card__body">
        <div className="training-card__activity">
          <span className="training-card__activity-emoji">
            {charmActivityEmoji[p.activity]}
          </span>
          <span className="training-card__activity-label">
            {charmActivityLabel[p.activity]}
          </span>
        </div>
        <div className="training-card__when">
          {dayLabel} · {timeLabel}
        </div>
        <div className="training-card__where">📍 {p.location}</div>
        <p className="training-card__appeal">&ldquo;{p.appeal}&rdquo;</p>
      </div>

      <div className="training-card__foot">
        <span className="training-card__foot-meta">
          <span>👤 0/1</span>
          <span>조회 {p.viewCount}</span>
        </span>
        <span className="training-card__apply-hint">지원하기 →</span>
      </div>
    </Link>
  );
}

function ReviewCard({ r }: { r: TrainingReviewMock }) {
  return (
    <article className="community-post-card">
      <div className="community-post-card__meta">
        <span className="community-post-card__board">
          #{charmActivityLabel[r.activity]}
        </span>
      </div>
      <h2 className="community-post-card__title">
        {r.authorNickname} → {r.guyNick}
      </h2>
      <p className="community-post-card__body">&ldquo;{r.text}&rdquo;</p>
      <div className="community-post-card__foot">
        <span className="community-post-card__timeMeta">
          <span>{r.createdAtRelative}</span>
        </span>
        <span className="community-post-card__stats">
          <span className="community-post-card__reaction">💚 {r.likes}</span>
        </span>
      </div>
    </article>
  );
}

/* ─────────────────────────  주간 캘린더  ───────────────────────── */

interface WeekDay {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "오늘" · "화" · ...
  dayNum: string; // "20"
}

function buildWeekFromToday(): WeekDay[] {
  // SSR/CSR 일관성 위해 오늘 새벽 KST 로 계산
  const now = new Date();
  const days: WeekDay[] = [];
  const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({
      date: iso,
      dayLabel: i === 0 ? "오늘" : weekLabels[d.getDay()],
      dayNum: String(d.getDate()),
    });
  }
  return days;
}

interface WeekCalendarProps {
  week: WeekDay[];
  selected: string | null;
  queryPreserve: { activity: string | null; by: string | null };
}

function WeekCalendar({ week, selected, queryPreserve }: WeekCalendarProps) {
  const buildHref = (date: string | null): string => {
    const parts: string[] = [];
    if (queryPreserve.activity) parts.push(`activity=${queryPreserve.activity}`);
    if (queryPreserve.by) parts.push(`by=${queryPreserve.by}`);
    if (date) parts.push(`day=${date}`);
    return parts.length > 0 ? `/coaching?${parts.join("&")}` : "/coaching";
  };
  return (
    <div className="week-calendar" role="tablist" aria-label="날짜 선택">
      {week.map((d) => {
        const active = selected === d.date;
        return (
          <Link
            key={d.date}
            href={buildHref(active ? null : d.date)}
            className={cn("week-calendar__day", active && "week-calendar__day--active")}
            role="tab"
            aria-selected={active}
          >
            <span className="week-calendar__label">{d.dayLabel}</span>
            <span className="week-calendar__num">{d.dayNum}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  helpers  ───────────────────────── */

function formatScheduled(iso: string): { dayLabel: string; timeLabel: string } {
  // iso 는 "YYYY-MM-DDTHH:mm" (KST 기준, 로컬)
  const [datePart, timePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);

  const today = new Date();
  const target = new Date(y, m - 1, d);
  const diffDays = Math.round(
    (target.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
      (1000 * 60 * 60 * 24)
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
