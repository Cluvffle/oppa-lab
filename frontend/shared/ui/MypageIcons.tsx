/**
 * 마이페이지 드롭다운/네비 아이콘 — 글래스모피즘.
 * 톤은 [[StatIcons]] 와 일치 (48 viewBox, 그라디언트 2겹 + 하이라이트).
 */

interface IconProps {
  size?: number;
}

/* ============================================================
 *  남성 세트 (5개)
 * ============================================================ */

/** 💬 내 소개팅 — 말풍선 + 하트 */
export function ThreadsGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-th-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="mp-th-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 말풍선 */}
      <path
        d="M8 14 Q8 8 14 8 L34 8 Q40 8 40 14 L40 26 Q40 32 34 32 L22 32 L14 40 L14 32 Q8 32 8 26 Z"
        fill="url(#mp-th-back)"
      />
      {/* 앞 하트 (말풍선 안에서 살짝 오프셋) */}
      <path
        d="M24 30 C24 30 14 24 14 18 C14 14 17 12 20 12 C22 12 23 13 24 15 C25 13 26 12 28 12 C31 12 34 14 34 18 C34 24 24 30 24 30 Z"
        fill="url(#mp-th-front)"
      />
      <ellipse cx="19" cy="16" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.7" transform="rotate(-25 19 16)" />
    </svg>
  );
}

/** 📈 성장 대시보드 — 상승 곡선 + 별 */
export function GrowthGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-gr-back" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#bfdbfe" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mp-gr-line" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#60a5fa" stopOpacity="0.95" />
          <stop offset="1" stopColor="#1d4ed8" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 배경 판 */}
      <rect x="6" y="10" width="36" height="30" rx="4" fill="url(#mp-gr-back)" />
      {/* 그리드 라인 */}
      <line x1="10" y1="34" x2="38" y2="34" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="28" x2="38" y2="28" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="22" x2="38" y2="22" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
      {/* 상승 곡선 (앞) */}
      <path
        d="M10 34 L18 28 L24 30 L32 20 L38 14"
        stroke="url(#mp-gr-line)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 끝 별 */}
      <circle cx="38" cy="14" r="3" fill="#fef08a" />
      <circle cx="38" cy="14" r="1.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

/** 🎬 내 어필 피드 — 카메라 + 스파클 */
export function AppealGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-ap-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbcfe8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mp-ap-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9a8d4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#db2777" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 후광 */}
      <circle cx="22" cy="26" r="18" fill="url(#mp-ap-back)" />
      {/* 카메라 몸체 */}
      <rect x="8" y="18" width="26" height="18" rx="4" fill="url(#mp-ap-body)" />
      <path d="M12 18 L16 14 L22 14 L26 18 Z" fill="url(#mp-ap-body)" />
      {/* 렌즈 */}
      <circle cx="21" cy="27" r="6" fill="#831843" opacity="0.9" />
      <circle cx="21" cy="27" r="3.5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="19" cy="25" r="1.5" fill="#fff" opacity="0.9" />
      {/* 플래시 홀 */}
      <rect x="28" y="21" width="3" height="2" rx="1" fill="#fff" opacity="0.7" />
      {/* 스파클 */}
      <circle cx="40" cy="12" r="1.5" fill="#fbcfe8" opacity="0.9" />
      <circle cx="38" cy="16" r="0.8" fill="#fff" opacity="0.7" />
      <circle cx="42" cy="30" r="1" fill="#f472b6" opacity="0.8" />
    </svg>
  );
}

/** 🆘 내 할까말까 — SOS 도너츠 링 + 물음표 */
export function EmergencyGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-em-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fecaca" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="mp-em-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fca5a5" stopOpacity="0.95" />
          <stop offset="1" stopColor="#dc2626" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 원 */}
      <circle cx="24" cy="24" r="18" fill="url(#mp-em-back)" />
      {/* 앞 링 */}
      <circle cx="24" cy="24" r="14" stroke="url(#mp-em-front)" strokeWidth="5" fill="none" />
      {/* 물음표 */}
      <path
        d="M20 20 Q20 15 24 15 Q28 15 28 19 Q28 22 24 24 L24 27"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="32" r="1.8" fill="#fff" />
      {/* 하이라이트 */}
      <path
        d="M14 18 Q18 14 22 14"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

/** 💳 결제·구독 — 카드 + 반짝 */
export function BillingGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-bi-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9d5ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mp-bi-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c084fc" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 카드 */}
      <rect x="4" y="14" width="36" height="22" rx="4" fill="url(#mp-bi-back)" transform="rotate(-6 22 24)" />
      {/* 앞 카드 */}
      <rect x="6" y="12" width="36" height="24" rx="4" fill="url(#mp-bi-front)" />
      {/* 마그네틱 스트라이프 */}
      <rect x="6" y="18" width="36" height="4" fill="#4c1d95" opacity="0.5" />
      {/* 칩 */}
      <rect x="11" y="26" width="6" height="5" rx="1" fill="#fbbf24" />
      {/* 카드번호 dots */}
      <circle cx="23" cy="30" r="0.9" fill="#fff" opacity="0.9" />
      <circle cx="26" cy="30" r="0.9" fill="#fff" opacity="0.9" />
      <circle cx="30" cy="30" r="0.9" fill="#fff" opacity="0.9" />
      <circle cx="33" cy="30" r="0.9" fill="#fff" opacity="0.9" />
      {/* 반짝 */}
      <circle cx="42" cy="10" r="1.5" fill="#e9d5ff" opacity="0.9" />
    </svg>
  );
}

/* ============================================================
 *  여성 세트 (4개)
 * ============================================================ */

/** 📅 오늘 할 일 — 체크리스트 + 알림 */
export function TodoGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-td-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fed7aa" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="mp-td-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdba74" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ea580c" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 클립보드 */}
      <rect x="9" y="10" width="26" height="32" rx="3" fill="url(#mp-td-back)" />
      {/* 앞 클립보드 */}
      <rect x="11" y="8" width="26" height="32" rx="3" fill="url(#mp-td-front)" />
      {/* 상단 클립 */}
      <rect x="18" y="4" width="12" height="8" rx="2" fill="#9a3412" opacity="0.9" />
      {/* 체크박스 3개 */}
      <rect x="16" y="17" width="4" height="4" rx="1" fill="#fff" opacity="0.9" />
      <path d="M17 19 L18 20 L20 18" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="23" y1="19" x2="33" y2="19" stroke="#fff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
      <rect x="16" y="24" width="4" height="4" rx="1" fill="#fff" opacity="0.9" />
      <path d="M17 26 L18 27 L20 25" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="23" y1="26" x2="33" y2="26" stroke="#fff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
      <rect x="16" y="31" width="4" height="4" rx="1" fill="#fff" opacity="0.9" />
      <line x1="23" y1="33" x2="30" y2="33" stroke="#fff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
      {/* 알림 점 */}
      <circle cx="38" cy="10" r="4" fill="#dc2626" />
      <circle cx="38" cy="10" r="1.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

/** 🕐 가능 시간 — 시계 */
export function ScheduleGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-sc-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bae6fd" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mp-sc-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7dd3fc" stopOpacity="0.95" />
          <stop offset="1" stopColor="#0284c7" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 원 */}
      <circle cx="24" cy="26" r="18" fill="url(#mp-sc-back)" />
      {/* 앞 링 */}
      <circle cx="24" cy="26" r="15" stroke="url(#mp-sc-front)" strokeWidth="3" fill="#e0f2fe" fillOpacity="0.15" />
      {/* 시각 마크 12/3/6/9 */}
      <circle cx="24" cy="13" r="1" fill="#075985" opacity="0.8" />
      <circle cx="37" cy="26" r="1" fill="#075985" opacity="0.8" />
      <circle cx="24" cy="39" r="1" fill="#075985" opacity="0.8" />
      <circle cx="11" cy="26" r="1" fill="#075985" opacity="0.8" />
      {/* 시침·분침 */}
      <line x1="24" y1="26" x2="24" y2="16" stroke="#075985" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="26" x2="32" y2="26" stroke="#075985" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="26" r="2" fill="#075985" />
      {/* 상단 크라운 (시간표 느낌) */}
      <rect x="21" y="6" width="6" height="3" rx="1" fill="url(#mp-sc-front)" />
    </svg>
  );
}

/** 💰 정산·포인트 — 동전 스택 */
export function PayoutGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-po-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#eab308" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mp-po-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde047" stopOpacity="0.98" />
          <stop offset="1" stopColor="#ca8a04" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 하단 동전 (뒷) */}
      <ellipse cx="24" cy="36" rx="16" ry="5" fill="url(#mp-po-back)" />
      <ellipse cx="24" cy="34" rx="16" ry="5" fill="url(#mp-po-front)" />
      {/* 중간 동전 */}
      <ellipse cx="24" cy="27" rx="16" ry="5" fill="url(#mp-po-back)" />
      <ellipse cx="24" cy="25" rx="16" ry="5" fill="url(#mp-po-front)" />
      {/* 위 동전 (앞) */}
      <ellipse cx="24" cy="18" rx="16" ry="5" fill="url(#mp-po-back)" />
      <ellipse cx="24" cy="16" rx="16" ry="5" fill="url(#mp-po-front)" />
      {/* ₩ 마크 */}
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="#78350f"
        opacity="0.85"
      >
        ₩
      </text>
      {/* 반짝 */}
      <circle cx="12" cy="10" r="1.5" fill="#fff" opacity="0.9" />
      <circle cx="38" cy="8" r="1" fill="#fef9c3" opacity="0.8" />
    </svg>
  );
}

/** 💌 내 활동 — 편지 + 하트 */
export function ActivityGlassIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-ac-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbcfe8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="mp-ac-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9a8d4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#be185d" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 봉투 뒤 */}
      <rect x="6" y="14" width="36" height="24" rx="3" fill="url(#mp-ac-back)" />
      {/* 봉투 뚜껑 */}
      <path d="M6 14 L24 28 L42 14 Z" fill="url(#mp-ac-front)" />
      {/* 봉투 좌우 라인 */}
      <path d="M6 38 L20 26" stroke="#831843" strokeWidth="1" opacity="0.4" />
      <path d="M42 38 L28 26" stroke="#831843" strokeWidth="1" opacity="0.4" />
      {/* 하트 (봉투 위) */}
      <path
        d="M24 34 C24 34 16 28 16 22 C16 19 18 17 20 17 C22 17 23 18 24 20 C25 18 26 17 28 17 C30 17 32 19 32 22 C32 28 24 34 24 34 Z"
        fill="url(#mp-ac-front)"
      />
      <ellipse cx="20" cy="20" rx="2" ry="1.2" fill="#fff" opacity="0.75" transform="rotate(-25 20 20)" />
    </svg>
  );
}

/* ============================================================
 *  프로필 · 레벨 배지
 * ============================================================ */

/** 유저 기본 프로필 (글라스 아바타) — 이니셜 · 실제 이미지 없을 때 */
export function ProfileGlassIcon({ size = 44 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mp-pf-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#5eead4" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0d9488" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="mp-pf-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="1" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="mp-pf-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0e7ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#a5b4fc" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="mp-pf-shine" cx="0.3" cy="0.3" r="0.4">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 배경 원 (글라스) */}
      <circle cx="24" cy="24" r="22" fill="url(#mp-pf-back)" />
      {/* 몸체 (아래 반원) */}
      <path d="M8 44 Q8 30 24 30 Q40 30 40 44 Z" fill="url(#mp-pf-body)" />
      {/* 머리 */}
      <circle cx="24" cy="20" r="9" fill="url(#mp-pf-head)" />
      {/* 상단 광택 */}
      <ellipse cx="18" cy="16" rx="5" ry="3" fill="url(#mp-pf-shine)" />
      {/* 눈웃음 */}
      <path d="M20 20 Q21 22 22 20" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M26 20 Q27 22 28 20" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

/** 레벨 배지 — 방패 형태 + Lv.N */
export function LevelGlassBadge({ level, size = 22 }: { level: number; size?: number }) {
  return (
    <span
      className="level-badge"
      title={`Lv.${level}`}
      style={{ height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="level-badge__shield"
      >
        <defs>
          <linearGradient id="lv-back" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde68a" stopOpacity="0.95" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="lv-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fef3c7" stopOpacity="1" />
            <stop offset="1" stopColor="#d97706" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* 뒷 방패 */}
        <path
          d="M12 1 L21 4 L21 12 Q21 18 12 23 Q3 18 3 12 L3 4 Z"
          fill="url(#lv-back)"
        />
        {/* 앞 방패 */}
        <path
          d="M12 3 L19 5.5 L19 12 Q19 17 12 21 Q5 17 5 12 L5 5.5 Z"
          fill="url(#lv-front)"
        />
        {/* 상단 광택 */}
        <path
          d="M7 6 Q10 5 12 5 Q14 5 17 6"
          stroke="#fff"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
      <span className="level-badge__text">Lv.{level}</span>
    </span>
  );
}
