"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { CreatorMock, MeetTier } from "@/shared/lib/mock";
import { meetTierIcon, meetTierText } from "@/features/mypage/lib/format";

interface AfterRequestPanelProps {
  creator: CreatorMock;
  /** 잠금 상태: 이미 진행 중인 신청/예약이 있으면 true */
  locked: boolean;
  lockedReason?: string;
}

/**
 * 다음 애프터 신청 CTA.
 * 여사친이 제공하지 않는 티어는 비활성. 잠금 상태면 전체 비활성 + 사유 노출.
 * 실제 신청 API는 후속 세션 — 여기선 티어 선택 UX 만.
 */
export function AfterRequestPanel({
  creator,
  locked,
  lockedReason,
}: AfterRequestPanelProps) {
  const [tier, setTier] = useState<MeetTier | null>(null);
  const { availability } = creator;

  const tiers: { key: MeetTier; enabled: boolean; hint?: string }[] = [
    { key: "voice", enabled: availability.offersVoice },
    { key: "video", enabled: availability.offersVideo },
    {
      key: "offline",
      enabled: availability.offersOffline,
      hint: availability.offersOffline
        ? availability.offlineRegions.join(" · ")
        : "이 친구는 오프라인 안 해",
    },
  ];

  return (
    <section
      className={cn(
        "after-panel",
        locked && "after-panel--locked"
      )}
    >
      <div className="after-panel__head">
        <h3 className="after-panel__title">다음 애프터 신청</h3>
        <p className="after-panel__sub">
          {locked
            ? lockedReason ?? "이번 회차 마치고 신청할 수 있어."
            : "티어를 골라. 어필은 오빠 몫이야."}
        </p>
      </div>

      <div className="after-panel__tiers">
        {tiers.map((t) => {
          const active = tier === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => !locked && t.enabled && setTier(t.key)}
              disabled={locked || !t.enabled}
              className={cn(
                "after-panel__tier",
                active && "after-panel__tier--active",
                !t.enabled && "after-panel__tier--disabled"
              )}
            >
              <span className="after-panel__tier-icon">
                {meetTierIcon(t.key)}
              </span>
              <span className="after-panel__tier-label">
                {meetTierText(t.key)}
              </span>
              {t.hint && (
                <span className="after-panel__tier-hint">{t.hint}</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={locked || !tier}
        className="after-panel__submit"
      >
        {locked
          ? "지금은 신청할 수 없어"
          : tier
            ? `${meetTierText(tier)} 회차 신청하기`
            : "티어 선택"}
      </button>

      <p className="after-panel__note">
        신청 즉시 조율 채팅이 열려. 시간·장소는 채팅에서 정하면 돼.
      </p>
    </section>
  );
}
