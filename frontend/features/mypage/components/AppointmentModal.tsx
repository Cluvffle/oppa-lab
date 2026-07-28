"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  addAppointment,
  appendMessage,
} from "@/features/mypage/lib/userThreadStore";
import type { CreatorMock } from "@/shared/lib/mock";

interface Props {
  threadId: string;
  creator: CreatorMock;
  onClose: () => void;
}

/**
 * 만남 예약 모달 — 날짜/시간/장소 3필드.
 * 저장 시 addAppointment + 채팅에 시스템 카드 삽입.
 */
export function AppointmentModal({ threadId, creator, onClose }: Props) {
  const today = new Date();
  const tomorrowIso = new Date(today.getTime() + 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  const [date, setDate] = useState(tomorrowIso);
  const [time, setTime] = useState("19:00");
  const [location, setLocation] = useState("");

  const canSave = date && time && location.trim().length > 0;

  const onSave = () => {
    if (!canSave) return;
    addAppointment(threadId, creator.id, { date, time, location: location.trim() });
    appendMessage(threadId, {
      senderId: "system",
      senderRole: "system",
      body: `📅 ${formatKoreanDate(date)} ${time} · ${location.trim()}에서 만남 예약 요청됨.`,
    });
    onClose();
  };

  return (
    <div
      className="appt-modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="appt-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="appt-modal__head">
          <span className="appt-modal__title">약속잡기</span>
          <button
            type="button"
            className="appt-modal__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
        <div className="appt-modal__body">
          <label className="appt-modal__field">
            <span>날짜</span>
            <input
              type="date"
              value={date}
              min={today.toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="appt-modal__field">
            <span>시간</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <label className="appt-modal__field">
            <span>장소</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 강남 스타벅스 R점"
            />
          </label>
          <p className="appt-modal__hint">
            요청 보내면 {creator.nickname}이 24시간 안에 확인해줄거야. 확정되면
            예정 시각 24시간 전부터 채팅 다시 열려.
          </p>
        </div>
        <div className="appt-modal__foot">
          <button
            type="button"
            className="appt-modal__btn appt-modal__btn--ghost"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="appt-modal__btn appt-modal__btn--primary"
            onClick={onSave}
            disabled={!canSave}
          >
            요청 보내기
          </button>
        </div>
      </div>
    </div>
  );
}

function formatKoreanDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
