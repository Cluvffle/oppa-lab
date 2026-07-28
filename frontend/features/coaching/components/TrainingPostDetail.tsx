"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  charmActivityEmoji,
  charmActivityLabel,
  type TrainingPostMock,
} from "@/shared/lib/mock";

interface Props {
  post: TrainingPostMock;
}

/**
 * 매력 트레이닝 모집 상세.
 * 스킬: [[charm-training]]
 * "지원하기" 는 지금 mock — 클릭 시 alert. 실제 배선은 채팅 스레드 통합 다음 단계.
 */
export function TrainingPostDetail({ post }: Props) {
  const { dayLabel, timeLabel } = formatScheduled(post.scheduledAt);

  const onApply = () => {
    // TODO(charm-training): 지원 → 채팅 스레드에 시스템 카드 추가
    alert(
      `${post.authorNickname}에게 "${charmActivityLabel[post.activity]}" 모집 지원 요청 보냈어. 채팅에서 응답 대기 중.`
    );
  };

  return (
    <main className="training-detail">
      <div className="container">
        <Link href="/coaching" className="training-detail__back">
          <ChevronLeft size={16} />
          모집 목록
        </Link>

        <div className="training-detail__author-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.authorAvatar}
            alt={post.authorNickname}
            className="training-detail__author-avatar"
          />
          <div className="training-detail__author-nickname">
            {post.authorNickname}
          </div>
          {post.authorRelationship && (
            <div className="training-detail__author-relationship">
              {post.authorRelationship}
            </div>
          )}
        </div>

        <section className="training-detail__section">
          <h1 className="training-detail__activity">
            {charmActivityEmoji[post.activity]} {charmActivityLabel[post.activity]}
          </h1>
          <div className="training-detail__row">
            <span className="training-detail__row-icon">📅</span>
            {dayLabel} · {timeLabel}
          </div>
          <div className="training-detail__row">
            <span className="training-detail__row-icon">📍</span>
            {post.location}
          </div>
          <div className="training-detail__row">
            <span className="training-detail__row-icon">👤</span>
            정원 1명 (선착순 확정)
          </div>
          <div className="training-detail__appeal-block">
            &ldquo;{post.appeal}&rdquo;
          </div>
        </section>

        <section className="training-detail__safety">
          <div className="training-detail__safety-title">📢 대면 안전 약속</div>
          공개장소에서만 · 사이다친구 프로필 인증 · 취소는 만남 3시간 전까지 ·
          위험 상황 시 신고 → 즉시 매칭 차단
        </section>

        <button
          type="button"
          className="training-detail__cta"
          onClick={onApply}
        >
          💬 이 모집 지원하기
          <span className="training-detail__cta-sub">
            1명 지원 시 자동 마감
          </span>
        </button>
      </div>
    </main>
  );
}

function formatScheduled(iso: string): { dayLabel: string; timeLabel: string } {
  const [datePart, timePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const today = new Date();
  const target = new Date(y, m - 1, d);
  const diffDays = Math.round(
    (target.getTime() -
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];
  let dayLabel: string;
  if (diffDays === 0) dayLabel = "오늘";
  else if (diffDays === 1) dayLabel = "내일";
  else dayLabel = `${m}월 ${d}일 (${weekLabels[target.getDay()]})`;

  const period = hh < 12 ? "오전" : "오후";
  const hh12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  const timeLabel = `${period} ${hh12}시${mm > 0 ? ` ${mm}분` : ""}`;
  return { dayLabel, timeLabel };
}
