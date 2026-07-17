/**
 * 실적 아이콘 3종 + 특기 뱃지 아이콘 6종 — 글래스모피즘 스타일.
 * 반투명 그라디언트 겹침으로 유리 감성.
 */

interface IconProps {
  size?: number;
}

/* ============================================================
   실적 아이콘 (통화/영상/오프라인)
   ============================================================ */

/**
 * 🎧 음성 통화 — 전화기 모양 (수화기 + 신호파)
 */
export function VoiceIcon({ size = 20 }: IconProps) {
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
        <linearGradient id="phone-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="phone-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 수화기 (연한 그린, 살짝 오프셋) */}
      <path
        d="M9 15 Q9 10 14 10 L16 10 Q20 10 20 14 L20 18 Q20 21 18 22 Q22 30 30 34 Q31 32 34 32 L38 32 Q42 32 42 36 L42 38 Q42 43 37 43 Q22 43 12 33 Q9 30 9 15 Z"
        fill="url(#phone-back)"
      />
      {/* 앞 수화기 (진한 그린) — 클래식 전화기 실루엣 */}
      <path
        d="M13 19 Q13 14 18 14 L20 14 Q24 14 24 18 L24 22 Q24 25 22 26 Q26 34 34 38 Q35 36 38 36 L42 36 Q46 36 46 40 L46 42 Q46 47 41 47 Q26 47 16 37 Q13 34 13 19 Z"
        fill="url(#phone-front)"
      />
      {/* 상단 신호파 (통화 중 표시) */}
      <circle cx="34" cy="14" r="2" fill="#10b981" opacity="0.85" />
      <path
        d="M30 12 Q34 8 38 12"
        stroke="#10b981"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
      />
      <path
        d="M28 8 Q34 2 40 8"
        stroke="#10b981"
        strokeWidth="2"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 📹 영상 통화 — 코랄톤 비디오 카메라
 */
export function VideoIcon({ size = 20 }: IconProps) {
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
        <linearGradient id="video-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fecdd3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fb7185" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="video-lens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fecdd3" stopOpacity="1" />
          <stop offset="1" stopColor="#fda4af" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="6" y="14" width="28" height="22" rx="5" fill="url(#video-body)" />
      <circle cx="20" cy="25" r="6" fill="url(#video-lens)" />
      <path d="M18 22 L24 25 L18 28 Z" fill="#fb7185" opacity="0.85" />
      <path d="M34 20 L42 15 L42 35 L34 30 Z" fill="url(#video-body)" />
      <rect x="8" y="16" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

/**
 * ❤️ 팔로워 — 이쁜 하트 (앞뒤 겹침 + 하이라이트로 유리 감성)
 */
export function FollowerIcon({ size = 20 }: IconProps) {
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
        <linearGradient id="heart-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fecdd3" stopOpacity="0.75" />
          <stop offset="1" stopColor="#f472b6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="heart-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fb7185" stopOpacity="1" />
          <stop offset="0.5" stopColor="#ec4899" stopOpacity="1" />
          <stop offset="1" stopColor="#be185d" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="heart-shine" cx="0.35" cy="0.3" r="0.4">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 뒷 하트 (연한 핑크, 살짝 크게, 은은한 뒷그림자) */}
      <path
        d="M24 42
           C 24 42, 4 30, 4 16
           C 4 9, 10 5, 15 5
           C 19 5, 22 7, 24 11
           C 26 7, 29 5, 33 5
           C 38 5, 44 9, 44 16
           C 44 30, 24 42, 24 42 Z"
        fill="url(#heart-back)"
      />

      {/* 앞 하트 (진한 그라디언트, 메인) */}
      <path
        d="M24 40
           C 24 40, 8 30, 8 18
           C 8 12, 12 8, 17 8
           C 20 8, 22 10, 24 13
           C 26 10, 28 8, 31 8
           C 36 8, 40 12, 40 18
           C 40 30, 24 40, 24 40 Z"
        fill="url(#heart-front)"
      />

      {/* 상단 좌측 광택 (유리/젤리 감성) */}
      <ellipse
        cx="17"
        cy="15"
        rx="6"
        ry="4"
        fill="url(#heart-shine)"
        transform="rotate(-25 17 15)"
      />

      {/* 작은 스파클 반짝임 */}
      <circle cx="35" cy="12" r="1.2" fill="#ffffff" opacity="0.9" />
      <circle cx="32" cy="16" r="0.7" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

/**
 * 🤝 만남 (오프라인) — 노란색 악수 (실제 두 손이 마주 잡는 형태)
 */
export function HandshakeIcon({ size = 20 }: IconProps) {
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
        <linearGradient id="hs-hand-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#eab308" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hs-hand-r" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcd34d" stopOpacity="0.98" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="hs-sleeve-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fde047" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="hs-sleeve-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* 왼쪽 소매 (사각 대각선) */}
      <path
        d="M2 30 L12 22 L18 28 L10 36 Z"
        fill="url(#hs-sleeve-l)"
      />
      {/* 오른쪽 소매 */}
      <path
        d="M46 30 L36 22 L30 28 L38 36 Z"
        fill="url(#hs-sleeve-r)"
      />

      {/* 왼손 (손등 + 손가락) — 오른쪽 아래로 향함 */}
      {/* 손등 (엄지 아래로 감싸는 실루엣) */}
      <path
        d="M12 22
           Q12 18 16 18
           L22 18
           Q26 18 28 22
           L28 30
           Q28 34 24 34
           L18 34
           Q12 34 12 30
           Z"
        fill="url(#hs-hand-l)"
      />
      {/* 왼손 엄지 */}
      <path
        d="M22 18 Q26 14 30 18 L28 22 Q26 20 22 22 Z"
        fill="url(#hs-hand-l)"
      />

      {/* 오른손 (반대쪽에서 마주 잡음) — 왼손 위로 걸침 */}
      <path
        d="M36 22
           Q36 18 32 18
           L26 18
           Q22 18 20 22
           L20 30
           Q20 34 24 34
           L30 34
           Q36 34 36 30
           Z"
        fill="url(#hs-hand-r)"
      />
      {/* 오른손 엄지 (위로 튀어나옴, 왼손 엄지와 교차) */}
      <path
        d="M26 18 Q22 14 18 18 L20 22 Q22 20 26 22 Z"
        fill="url(#hs-hand-r)"
      />

      {/* 교차부 하이라이트 (두 손이 겹치는 중앙) */}
      <ellipse cx="24" cy="26" rx="4" ry="2" fill="#ffffff" opacity="0.35" />

      {/* 손가락 관절 라인 (오른손) */}
      <line
        x1="24"
        y1="24"
        x2="30"
        y2="24"
        stroke="#78350f"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="24"
        y1="28"
        x2="30"
        y2="28"
        stroke="#78350f"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

/* ============================================================
   특기 뱃지 아이콘 (specialty)
   ============================================================ */

/**
 * 💬 카톡 저격수 — 말풍선 안에 물음표 대신 하이라이트
 */
export function KakaoSpecialtyIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-kakao" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#facc15" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path
        d="M8 14 Q8 8 14 8 L34 8 Q40 8 40 14 L40 26 Q40 32 34 32 L22 32 L14 40 L14 32 Q8 32 8 26 Z"
        fill="url(#sp-kakao)"
      />
      <circle cx="18" cy="20" r="2" fill="#78350f" opacity="0.7" />
      <circle cx="24" cy="20" r="2" fill="#78350f" opacity="0.7" />
      <circle cx="30" cy="20" r="2" fill="#78350f" opacity="0.7" />
    </svg>
  );
}

/**
 * 👔 스타일 코치 — 옷 실루엣
 */
export function StyleSpecialtyIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-style" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9d5ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* 셔츠/재킷 실루엣 */}
      <path
        d="M14 12 L20 8 L24 12 L28 8 L34 12 L38 18 L34 20 L34 40 L14 40 L14 20 L10 18 Z"
        fill="url(#sp-style)"
      />
      {/* 브이넥 */}
      <path d="M20 8 L24 16 L28 8" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* 단추 */}
      <circle cx="24" cy="24" r="1.2" fill="#7c3aed" opacity="0.7" />
      <circle cx="24" cy="30" r="1.2" fill="#7c3aed" opacity="0.7" />
    </svg>
  );
}

/**
 * 🎤 목소리 튜너 — 마이크
 */
export function VoiceSpecialtyIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-mic" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bae6fd" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {/* 마이크 헤드 */}
      <rect x="18" y="8" width="12" height="20" rx="6" fill="url(#sp-mic)" />
      {/* 그물 라인 */}
      <line x1="19" y1="14" x2="29" y2="14" stroke="#0369a1" strokeWidth="1" opacity="0.4" />
      <line x1="19" y1="18" x2="29" y2="18" stroke="#0369a1" strokeWidth="1" opacity="0.4" />
      <line x1="19" y1="22" x2="29" y2="22" stroke="#0369a1" strokeWidth="1" opacity="0.4" />
      {/* 지지대 */}
      <path
        d="M13 26 Q13 34 24 34 Q35 34 35 26"
        stroke="url(#sp-mic)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* 스탠드 */}
      <rect x="22" y="34" width="4" height="6" fill="url(#sp-mic)" />
      <rect x="18" y="40" width="12" height="2" rx="1" fill="url(#sp-mic)" />
    </svg>
  );
}

/**
 * 💭 마음 캐치 — 하트 + 반짝임
 */
export function MindSpecialtyIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-heart-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbcfe8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f472b6" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="sp-heart-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9a8d4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 하트 */}
      <path
        d="M14 18 Q14 10 20 10 Q23 10 24 14 Q25 10 28 10 Q34 10 34 18 Q34 26 24 34 Q14 26 14 18 Z"
        fill="url(#sp-heart-back)"
      />
      {/* 앞 하트 */}
      <path
        d="M18 22 Q18 14 24 14 Q27 14 28 18 Q29 14 32 14 Q38 14 38 22 Q38 30 28 38 Q18 30 18 22 Z"
        fill="url(#sp-heart-front)"
      />
      {/* 반짝임 */}
      <circle cx="10" cy="12" r="1.5" fill="#f472b6" opacity="0.8" />
      <circle cx="40" cy="30" r="1" fill="#ec4899" opacity="0.7" />
    </svg>
  );
}

/**
 * 🔥 실전 사령관 — 불꽃
 */
export function RealSpecialtyIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-fire-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fed7aa" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="sp-fire-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdba74" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ea580c" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* 뒷 불꽃 (연한) */}
      <path
        d="M24 4 Q34 14 34 24 Q34 36 24 42 Q14 36 14 24 Q14 14 24 4 Z"
        fill="url(#sp-fire-back)"
      />
      {/* 앞 불꽃 (진한) */}
      <path
        d="M24 12 Q30 20 30 26 Q30 34 24 40 Q18 34 18 26 Q18 20 24 12 Z"
        fill="url(#sp-fire-front)"
      />
      {/* 코어 하이라이트 */}
      <circle cx="24" cy="28" r="3" fill="#fff7ed" opacity="0.85" />
    </svg>
  );
}

/**
 * 🌸 편안한 사람 — 소프트 꽃/구름
 */
export function WarmSpecialtyIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-warm-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fce7f3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f9a8d4" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="sp-warm-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbcfe8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* 꽃잎 5개 (뒷) */}
      <circle cx="24" cy="12" r="8" fill="url(#sp-warm-back)" />
      <circle cx="12" cy="22" r="8" fill="url(#sp-warm-back)" />
      <circle cx="36" cy="22" r="8" fill="url(#sp-warm-back)" />
      <circle cx="17" cy="36" r="8" fill="url(#sp-warm-back)" />
      <circle cx="31" cy="36" r="8" fill="url(#sp-warm-back)" />
      {/* 중앙 (앞) */}
      <circle cx="24" cy="24" r="8" fill="url(#sp-warm-front)" />
      <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

/* 특기 아이콘 컴포넌트들은 개별 export 되어있어 필요 시 직접 임포트 */
