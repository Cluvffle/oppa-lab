interface Props {
  size?: number;
}

/**
 * 사이다 댓글(말풍선) 아이콘 — CiderBellIcon 톤과 통일.
 * 그린 그라디언트 + 검정 stroke + 흰 반짝 하이라이트.
 */
export function CiderCommentIcon({ size = 16 }: Props) {
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
        <linearGradient id="cider-cmt-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#22C55E" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cider-cmt-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B2A1F" />
          <stop offset="1" stopColor="#166534" />
        </linearGradient>
      </defs>

      {/* 말풍선 몸체 (둥근 사각형 + 좌측 하단 꼬리) */}
      <path
        d="M10 10
           Q10 6, 14 6
           L34 6
           Q38 6, 38 10
           L38 26
           Q38 30, 34 30
           L22 30
           L14 38
           L15 30
           Q10 30, 10 26 Z"
        fill="url(#cider-cmt-body)"
        stroke="url(#cider-cmt-stroke)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* 대화 점 3개 */}
      <circle cx="17" cy="18" r="2" fill="#FFFFFF" />
      <circle cx="24" cy="18" r="2" fill="#FFFFFF" />
      <circle cx="31" cy="18" r="2" fill="#FFFFFF" />

      {/* 상단 하이라이트 */}
      <ellipse
        cx="17"
        cy="10"
        rx="5"
        ry="1.5"
        fill="#FFFFFF"
        opacity="0.55"
      />
    </svg>
  );
}
