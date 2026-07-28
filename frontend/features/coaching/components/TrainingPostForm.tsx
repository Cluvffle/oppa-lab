"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import {
  charmActivityEmoji,
  charmActivityLabel,
  type CharmActivityKind,
} from "@/shared/lib/mock";

const ACTIVITIES: CharmActivityKind[] = [
  "wardrobe",
  "photo",
  "cafe",
  "food",
  "activity",
];

/**
 * 매력 트레이닝 모집 오픈 폼.
 * MVP: 활동 · 날짜 · 시간 · 장소 · 한줄 어필 → 로컬 mock 저장.
 * 실제 배선: cider:trainingPosts localStorage 저장 (다음 단계에서 스토어로 분리).
 */
export function TrainingPostForm() {
  const router = useRouter();
  const [activity, setActivity] = useState<CharmActivityKind | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [appeal, setAppeal] = useState("");

  const canSubmit =
    !!activity &&
    date.length > 0 &&
    time.length > 0 &&
    location.trim().length > 0 &&
    appeal.trim().length > 0;

  const onSubmit = () => {
    // TODO(charm-training): 스토어 push. 지금은 alert + 목록으로.
    alert(
      `모집 오픈: ${charmActivityLabel[activity!]} · ${date} ${time} · ${location}`
    );
    router.push("/coaching");
  };

  return (
    <main className="charm-training">
      <div className="container">
        <Link href="/coaching" className="training-detail__back">
          <ChevronLeft size={16} />
          취소
        </Link>

        <h1 className="charm-training__title">모집 만들기</h1>
        <p className="charm-training__sub">
          이성친구랑 편하게 할 대면 활동을 열어봐. 정원 1명 · 선착순.
        </p>

        <div className="training-form">
          <div className="training-form__field">
            <div className="training-form__label">어떤 활동?</div>
            <div className="training-form__activity-grid">
              {ACTIVITIES.map((a) => {
                const on = activity === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setActivity(a)}
                    className={cn(
                      "training-form__activity-btn",
                      on && "training-form__activity-btn--on"
                    )}
                    aria-pressed={on}
                  >
                    <span className="training-form__activity-emoji">
                      {charmActivityEmoji[a]}
                    </span>
                    <span>{charmActivityLabel[a]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="training-form__field">
            <div className="training-form__label">언제?</div>
            <div className="training-form__row">
              <input
                type="date"
                className="training-form__input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="날짜"
              />
              <input
                type="time"
                className="training-form__input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                aria-label="시간"
              />
            </div>
          </div>

          <div className="training-form__field">
            <div className="training-form__label">어디서?</div>
            <input
              type="text"
              className="training-form__input"
              placeholder="예: 강남 앤트러사이트"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={40}
            />
          </div>

          <div className="training-form__field">
            <div className="training-form__label">한 줄 어필</div>
            <textarea
              className="training-form__textarea"
              placeholder="예: 카페 좋아하는 오빠 나와~ 2시간 잔잔한 대화 콜?"
              value={appeal}
              onChange={(e) => setAppeal(e.target.value.slice(0, 80))}
              maxLength={80}
            />
            <span className="training-form__counter">{appeal.length}/80</span>
          </div>

          <button
            type="button"
            className="training-form__submit"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            모집 오픈
          </button>
        </div>
      </div>
    </main>
  );
}
