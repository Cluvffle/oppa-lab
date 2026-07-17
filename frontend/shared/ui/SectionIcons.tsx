/**
 * 홈 섹션 타이틀용 글래스모피즘 아이콘 5종.
 * StatIcons(실적 아이콘)과 톤 통일.
 */

interface IconProps {
  size?: number;
}

/**
 * 🟢 지금 온라인 — 반짝이는 라임 원 (라이브 뱃지 감성)
 */
export function LiveIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="live-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.4" />
          <stop offset="0.7" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="live-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" stopOpacity="1" />
          <stop offset="1" stopColor="#059669" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* 외부 발광 */}
      <circle cx="24" cy="24" r="22" fill="url(#live-glow)" />
      {/* 중간 링 (반투명) */}
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="#a7f3d0"
        opacity="0.35"
      />
      {/* 코어 원 */}
      <circle cx="24" cy="24" r="10" fill="url(#live-core)" />
      {/* 하이라이트 */}
      <ellipse
        cx="20"
        cy="20"
        rx="4"
        ry="3"
        fill="#ffffff"
        opacity="0.6"
        transform="rotate(-30 20 20)"
      />
    </svg>
  );
}

/**
 * 💬 오늘의 팩폭 — 인용 말풍선 (그린 톤)
 */
export function CommentIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="comment-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="comment-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#059669" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 말풍선 (연한, 좌상단) */}
      <path
        d="M4 12 Q4 6 10 6 L26 6 Q32 6 32 12 L32 22 Q32 28 26 28 L16 28 L10 34 L10 28 Q4 28 4 22 Z"
        fill="url(#comment-back)"
      />
      {/* 앞 말풍선 (진한, 우하단) */}
      <path
        d="M16 20 Q16 14 22 14 L38 14 Q44 14 44 20 L44 30 Q44 36 38 36 L28 36 L22 42 L22 36 Q16 36 16 30 Z"
        fill="url(#comment-front)"
      />
      {/* 인용 마크 (") */}
      <path
        d="M24 22 L24 26 M22 22 L22 26"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M32 22 L32 26 M30 22 L30 26"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * 📸 인기 어필 피드 — 폴라로이드 사진 (코랄 톤)
 */
export function FeedIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="feed-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fecdd3" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fb7185" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="feed-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fda4af" stopOpacity="0.95" />
          <stop offset="1" stopColor="#e11d48" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="feed-photo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fecdd3" stopOpacity="1" />
          <stop offset="1" stopColor="#fda4af" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* 뒷 폴라로이드 (기울어짐) */}
      <rect
        x="6"
        y="10"
        width="26"
        height="30"
        rx="3"
        fill="url(#feed-back)"
        transform="rotate(-12 19 25)"
      />
      {/* 앞 폴라로이드 */}
      <rect
        x="14"
        y="8"
        width="28"
        height="32"
        rx="3"
        fill="url(#feed-front)"
      />
      {/* 사진 영역 */}
      <rect
        x="17"
        y="11"
        width="22"
        height="20"
        rx="1"
        fill="url(#feed-photo)"
      />
      {/* 사진 안 태양+산 (미니 풍경) */}
      <circle cx="24" cy="18" r="2.5" fill="#fbbf24" opacity="0.9" />
      <path
        d="M17 28 L23 21 L28 25 L34 20 L39 28 Z"
        fill="#e11d48"
        opacity="0.5"
      />
      {/* 하단 캡션 영역 (폴라로이드 여백) */}
      <rect
        x="19"
        y="34"
        width="14"
        height="2"
        rx="1"
        fill="#ffffff"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * 🔥 실시간 커뮤니티 — 불꽃 (오렌지 톤)
 */
export function CommunityIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="fire-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fed7aa" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fb923c" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="fire-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdba74" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ea580c" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="fire-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="1" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* 외부 불꽃 (연한) */}
      <path
        d="M24 4
           Q30 12 34 18
           Q38 24 38 30
           Q38 40 24 44
           Q10 40 10 30
           Q10 24 14 18
           Q18 12 24 4 Z"
        fill="url(#fire-back)"
      />
      {/* 중간 불꽃 */}
      <path
        d="M24 12
           Q28 18 30 22
           Q32 26 32 30
           Q32 38 24 40
           Q16 38 16 30
           Q16 26 18 22
           Q20 18 24 12 Z"
        fill="url(#fire-mid)"
      />
      {/* 코어 불꽃 (제일 밝음) */}
      <path
        d="M24 22
           Q26 26 27 29
           Q27 34 24 36
           Q21 34 21 29
           Q22 26 24 22 Z"
        fill="url(#fire-core)"
      />
      {/* 스파크 */}
      <circle cx="34" cy="14" r="1.2" fill="#fbbf24" opacity="0.85" />
      <circle cx="12" cy="20" r="1" fill="#fdba74" opacity="0.7" />
    </svg>
  );
}

/**
 * 🤔 물음표 — 할까말까 감성 (옐로 톤). 필요시 사용.
 */
export function QuestionIcon({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="q-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#facc15" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="q-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde047" stopOpacity="0.98" />
          <stop offset="1" stopColor="#ca8a04" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 원 (그림자) */}
      <circle cx="26" cy="26" r="20" fill="url(#q-back)" />
      {/* 앞 원 (메인) */}
      <circle cx="22" cy="22" r="18" fill="url(#q-front)" />
      {/* 물음표 (?) */}
      <path
        d="M17 16
           Q17 11 22 11
           Q28 11 28 16
           Q28 20 22 22
           L22 26"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="31" r="2" fill="#ffffff" />
    </svg>
  );
}
