import {
  VoiceIcon,
  VideoIcon,
  HandshakeIcon,
} from "@/shared/ui/StatIcons";
import { meetTierLabel, type MeetTier } from "@/shared/lib/mock";
import { cn } from "@/shared/lib/cn";

interface Props {
  tier: MeetTier;
  /** 라벨 숨김 (스텝퍼처럼 좁은 공간용) */
  iconOnly?: boolean;
  /** 라벨 대신 숫자 카운트 표시 (툴팁으로 티어명) */
  count?: number;
  /** 아이콘 크기 */
  iconSize?: number;
}

/**
 * 팩폭 후기(comment-tile__tier) 와 동일한 pill 뱃지 스타일.
 * 티어별 색 (voice=그린 · video=코랄 · offline=골드) + 글라스 아이콘.
 *
 * 3가지 모드:
 *  기본           → [아이콘] 목소리
 *  iconOnly       → [아이콘]
 *  count 지정     → [아이콘] N (툴팁으로 티어명)
 */
export function TierBadge({ tier, iconOnly = false, count, iconSize = 14 }: Props) {
  const Icon =
    tier === "voice" ? VoiceIcon : tier === "video" ? VideoIcon : HandshakeIcon;
  const label = meetTierLabel[tier];
  const isCount = typeof count === "number";
  return (
    <span
      className={cn("tier-badge", `tier-badge--${tier}`)}
      title={isCount ? `${label} ${count}회` : undefined}
    >
      <Icon size={iconSize} />
      {isCount ? (
        <span className="tier-badge__count">{count}</span>
      ) : !iconOnly ? (
        <span>{label}</span>
      ) : null}
    </span>
  );
}
