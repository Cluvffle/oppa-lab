interface Props {
  size?: number;
  /** 알림 도트 (오른쪽 위 소소한 액센트) */
  hasUnread?: boolean;
}

/**
 * 사이다 종 아이콘 — 마스코트 톤 (그린 그라디언트 + 검정 stroke).
 * hasUnread 시 우상단 빨간 도트.
 */
export function CiderBellIcon({ size = 26, hasUnread = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cider-bell-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#22C55E" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="cider-bell-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B2A1F" />
          <stop offset="1" stopColor="#166534" />
        </linearGradient>
      </defs>

      {/* 종 몸체 */}
      <path
        d="M24 8
           C 32 8, 36 14, 36 22
           L 36 30
           L 40 34
           L 8 34
           L 12 30
           L 12 22
           C 12 14, 16 8, 24 8 Z"
        fill="url(#cider-bell-body)"
        stroke="url(#cider-bell-dark)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 종 상단 손잡이 */}
      <rect
        x="20"
        y="5"
        width="8"
        height="4"
        rx="1.5"
        fill="#FFFFFF"
        stroke="url(#cider-bell-dark)"
        strokeWidth="1.6"
      />

      {/* 반짝 하이라이트 */}
      <ellipse
        cx="18"
        cy="16"
        rx="3"
        ry="1.6"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-20 18 16)"
      />

      {/* 종 추 */}
      <circle
        cx="24"
        cy="38"
        r="3.4"
        fill="url(#cider-bell-body)"
        stroke="url(#cider-bell-dark)"
        strokeWidth="1.8"
      />

      {/* 알림 도트 */}
      {hasUnread && (
        <>
          <circle cx="37" cy="12" r="6" fill="#FFFFFF" />
          <circle cx="37" cy="12" r="4.5" fill="#E11D48" />
        </>
      )}
    </svg>
  );
}
