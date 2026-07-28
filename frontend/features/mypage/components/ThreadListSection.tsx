"use client";

import { useMemo, useState } from "react";
import { ThreadCard } from "./ThreadCard";
import { SegmentHeader } from "./SegmentHeader";
import { MultiSelectDropdown } from "@/shared/ui/MultiSelectDropdown";
import type { ThreadSummary } from "@/features/mypage/lib/selectors";

type StatusKey =
  | "scheduling"
  | "upcoming"
  | "awaiting_feedback"
  | "ready_for_after";

interface Props {
  title: string;
  subtitle: string;
  summaries: ThreadSummary[];
  viewer: "user" | "creator";
  /** creator 뷰에서는 "피드백 미작성" 을 상단으로 자동 정렬 */
  prioritizeFeedback?: boolean;
}

const STATUS_OPTIONS: { value: StatusKey; label: string }[] = [
  { value: "upcoming", label: "예약 확정" },
  { value: "scheduling", label: "조율 중" },
  { value: "awaiting_feedback", label: "피드백 대기" },
  { value: "ready_for_after", label: "신청 가능" },
];

/**
 * 세그먼트 헤더 + 필터 + 스레드 리스트를 함께 렌더.
 * 필터는 헤더 우측 액션 슬롯에 배치 (/dating 톤).
 * 그리드 위에 divider 라인 (/dating creator-list 스타일).
 */
export function ThreadListSection({
  title,
  subtitle,
  summaries,
  viewer,
  prioritizeFeedback = false,
}: Props) {
  const [statuses, setStatuses] = useState<StatusKey[]>([]);

  const filtered = useMemo(() => {
    const base =
      statuses.length === 0
        ? summaries
        : summaries.filter((s) =>
            statuses.includes(s.statusLabel.kind as StatusKey)
          );
    if (!prioritizeFeedback) return base;
    return base.slice().sort((a, b) => {
      const aw = a.statusLabel.kind === "awaiting_feedback" ? 0 : 1;
      const bw = b.statusLabel.kind === "awaiting_feedback" ? 0 : 1;
      return aw - bw;
    });
  }, [summaries, statuses, prioritizeFeedback]);

  return (
    <>
      <SegmentHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="thread-list__filters">
            <MultiSelectDropdown<StatusKey>
              label="상태"
              options={STATUS_OPTIONS}
              selected={statuses}
              onChange={setStatuses}
            />
          </div>
        }
      />

      {/* 그리드 위 divider (/dating 스타일) */}
      <div className="thread-list__divider" />

      {filtered.length === 0 ? (
        <div className="thread-list__empty">
          {viewer === "user"
            ? "아직 이 조건의 소개팅이 없어. 새 사이다 친구이랑 시작해보자."
            : "이 조건의 오빠 아직 없네."}
        </div>
      ) : (
        <div className="thread-list__grid">
          {filtered.map((s) => (
            <ThreadCard key={s.thread.id} s={s} viewer={viewer} />
          ))}
        </div>
      )}
    </>
  );
}
