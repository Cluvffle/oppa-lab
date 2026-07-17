---
name: design-system
description: 챠밍 비주얼 시스템 — 컬러 팔레트 · 블랙/화이트 토글 · 타이포 · 레이아웃 · 컴포넌트 규칙. UI 작성 시 항상 참조.
---

# Design System

브랜드 방향은 [[brand-charming]], 서비스 무드 레퍼런스는 치지직(chzzk.naver.com).

## 무드 요약

- **놀이터 감성**: 편안하게 매일 놀러 오는 곳
- **다크 기본톤 + 강렬한 액센트**: 치지직 라임그린 스타일
- **카드 기반 그리드**: 스트리머 카드 → 친구 카드 / 어필 피드 / 할까말까 카드
- **캐릭터 컬러 포인트**: 흑백 UI 사이에 친구 캐릭터가 컬러 액센트

## 블랙 / 화이트 토글

CSS 변수 기반. `data-theme="dark"` / `data-theme="light"` 를 `<html>` 에 적용.

```css
/* frontend/app/globals.css */
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg-primary: #0F0F0F;      /* 딥 블랙 (히어로/풀블리드) */
  --bg-secondary: #1A1A1A;    /* 카드 배경 */
  --bg-elevated: #252525;     /* 호버/포커스/모달 */
  --bg-overlay: rgba(0,0,0,0.6);
  
  /* Borders */
  --border-subtle: #2E2E2E;
  --border-strong: #3F3F3F;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --text-muted: #6E6E6E;
  --text-inverse: #0F0F0F;    /* 액센트 위 텍스트 */
  
  /* Accent — 챠밍 시그니처 라임 */
  --accent: #00FFA3;
  --accent-hover: #00E693;
  --accent-muted: rgba(0,255,163,0.12);
  --accent-glow: 0 0 20px rgba(0,255,163,0.4);
  
  /* Semantic */
  --success: #00FFA3;
  --danger: #FF4D6D;
  --warning: #FFB800;
  --info: #4DA6FF;
  
  /* Life Stage Colors (지표/뱃지용) */
  --stage-rookie: #7DD3FC;      /* 연한 파랑 */
  --stage-growing: #6EE7B7;     /* 새싹 초록 */
  --stage-challenger: #FCD34D;  /* 도전 노랑 */
  --stage-grad-plus: #C084FC;   /* 성숙 보라 */
}

:root[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F7F8;
  --bg-elevated: #EFEFF1;
  --bg-overlay: rgba(255,255,255,0.85);
  
  --border-subtle: #E4E4E7;
  --border-strong: #D4D4D8;
  
  --text-primary: #0F0F0F;
  --text-secondary: #52525B;
  --text-muted: #A1A1AA;
  --text-inverse: #FFFFFF;
  
  --accent: #00B87A;
  --accent-hover: #009E68;
  --accent-muted: rgba(0,184,122,0.10);
  --accent-glow: 0 0 20px rgba(0,184,122,0.3);
  
  --success: #00B87A;
  --danger: #E11D48;
  --warning: #F59E0B;
  --info: #2563EB;
  
  --stage-rookie: #0284C7;
  --stage-growing: #059669;
  --stage-challenger: #D97706;
  --stage-grad-plus: #7C3AED;
}
```

**핵심 룰**: 모든 컴포넌트는 **CSS 변수만** 참조. Tailwind 색상 유틸리티 (`bg-black`, `text-white`) 직접 사용 금지. `rgba()` 하드코딩 금지.

### 토글 UX
- 헤더 우측 태양/달 아이콘 토글
- 첫 방문: `prefers-color-scheme` 기반 자동 선택
- 유저 선택은 `localStorage` 에 저장
- 통화 페이지는 라이트 모드에서도 **다크 강제** (몰입)

## 타이포그래피

**폰트**: [Pretendard Variable](https://github.com/orioncactus/pretendard)

```css
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;

--text-xs: 12px;     /* 캡션, 뱃지 */
--text-sm: 14px;     /* 보조 텍스트 */
--text-base: 16px;   /* 본문 */
--text-lg: 18px;     /* 강조 본문 */
--text-xl: 20px;     /* 카드 타이틀 */
--text-2xl: 24px;    /* 섹션 타이틀 */
--text-3xl: 32px;    /* 페이지 타이틀 */
--text-4xl: 40px;    /* 서브 히어로 */
--text-hero: 56px;   /* 히어로 */
--text-massive: 72px; /* 랜딩 대형 카피 */

--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;   /* 히어로/CTA 대형 */

--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.7;

--tracking-tight: -0.02em;   /* 큰 제목용 */
--tracking-normal: 0;
```

## 스페이싱 & 레이아웃

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

--container-max: 1280px;
--sidebar-width: 240px;
--header-height: 64px;
```

## 그리드 브레이크포인트

```css
--bp-sm: 640px;   /* 모바일 최대 */
--bp-md: 768px;   /* 태블릿 */
--bp-lg: 1024px;  /* 데스크탑 최소 */
--bp-xl: 1280px;  /* 대형 */
```

**모바일 우선 설계**. 카드 그리드:
- 모바일: 2열
- 태블릿: 3열
- 데스크탑: 4~5열

## 컴포넌트 규칙

### 버튼

```
.btn                    → 기본 (bg-elevated + text-primary)
.btn-primary            → 액센트 CTA
.btn-ghost              → 배경 없음, 텍스트 강조
.btn-danger             → 위험 액션
.btn-relationship       → 관계 할까말까/상담 강조용 (핑크 그라디언트)

크기: .btn-sm / .btn-md (기본) / .btn-lg
```

**Primary 버튼**: 액센트 배경 + **--text-inverse 텍스트** (라임 위엔 검정이 가독성 최고).

### 친구 카드 (챠밍의 시그니처 컴포넌트)

```
.creator-card
  ├─ .creator-card__character   (캐릭터 이미지, 3:4 비율)
  ├─ .creator-card__online      (좌상단 온라인 뱃지, 반짝임 애니메이션)
  ├─ .creator-card__type        (우상단 유형 뱃지 — 연습 파트너/연애 코치/관계 상담사)
  ├─ .creator-card__info
  │    ├─ .creator-card__nickname
  │    ├─ .creator-card__meta   (나이 · 직업 · MBTI)
  │    └─ .creator-card__tags   (성격 태그 3개)
  ├─ .creator-card__stats       (평점 · 총 대화)
  └─ .creator-card__cta         ("조언 받기")
```

**호버 인터랙션**:
```css
.creator-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--accent-glow);
  transition: all 0.2s ease;
}
```

### 할까말까 카드

```
.emergency-card
  ├─ .emergency-card__room-badge   (카톡/스타일/프로필/관계)
  ├─ .emergency-card__title
  ├─ .emergency-card__attachment-preview (썸네일)
  ├─ .emergency-card__meta         (작성자 · 시각)
  └─ .emergency-card__stats        (답변 수, 도움됨)
```

### 어필 피드 카드 (인스타 스타일)

- 정사각 미디어 프리뷰
- 하단 하트 카운트 + 여성 피드백 카운트
- 성장 페어 표시 (before/after 뱃지)

### 뱃지

```
.badge                     → 기본
.badge-online              → 초록 점 + 반짝임 (--accent)
.badge-offline             → 회색 (--text-muted)
.badge-creator-type        → 친구 유형별 컬러
.badge-stage-rookie        → --stage-rookie
.badge-stage-growing       → --stage-growing
.badge-stage-challenger    → --stage-challenger
.badge-stage-grad-plus     → --stage-grad-plus
.badge-graduate            → 골드 그라디언트 (특별)
.badge-oppa-mentor         → "챠밍에서 시작한 오빠" (Grad+ 커뮤니티 답변)
```

### 통화 페이지 (WebRTC UI)

- **풀 스크린 다크 강제** (라이트 모드에서도 다크)
- 중앙: 친구 캐릭터 대형 (음성 통화는 캐릭터, 영상 통화는 비디오)
- 하단 컨트롤: 마이크 / 카메라 / 종료 / 볼륨
- 우측 사이드: 음성 파형 시각화 + 남은 시간
- 종료 시: 리포트 작성 화면으로 자동 전환

### 대시보드 위젯

```
.widget                  → 기본 카드
.widget--metric          → 지표 카드 (수치 + 델타 화살표)
.widget--radar           → 레이더 차트 컨테이너
.widget--timeline        → 활동 타임라인
.widget--recommendation  → 다음 스텝 추천 (액센트 강조)
.widget--network         → 여성 네트워크
.widget--stage-specific  → 라이프사이클 단계별 (동적)
```

라이프사이클 위젯 세부는 [[lifecycle]] 참조.

## 아이콘

**lucide-react** 통일. 다른 아이콘 라이브러리 섞지 않음. 커스텀 아이콘은 SVG 컴포넌트로.

## 애니메이션

**Framer Motion** 사용. 부드럽고 절제된 인터랙션.

```css
/* 온라인 뱃지 반짝임 */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 var(--accent-muted); }
  50%      { box-shadow: 0 0 0 8px transparent; }
}

/* 카드 호버 */
--transition-fast: 0.15s ease;
--transition-base: 0.25s ease;
--transition-slow: 0.4s ease;

/* 페이지 전환 */
/* Framer Motion: fade + slide-up */
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.3, ease: 'easeOut' }
```

## 접근성

- 모든 액션에 `aria-label`
- WCAG AA 대비 확보 (액센트 위 텍스트는 4.5:1 이상)
- 포커스 링: `outline: 2px solid var(--accent); outline-offset: 2px`
- 다크/라이트 모두 검증

## 아바타/캐릭터 표시 규칙

- **여성 친구**: 항상 캐릭터 이미지 (PixelLab 생성)
- **남성 유저**: 
  - 프로필 사진 공개 + 로그인 상태: 실사 사진
  - 비공개 or 커뮤니티: 이니셜 아바타 (자동 생성, 스테이지 컬러 배경)

## 홈 놀이터 레이아웃 (참고)

```
┌──────────────────────────────────────────────┐
│  [챠밍]   [피드][할까말까][{{NUNA}}들][커뮤니티]  🌗👤 │
├──────────────────────────────────────────────┤
│                                                │
│   🟢 지금 온라인                                 │
│   [카드][카드][카드][카드][카드]  →             │
│                                                │
├──────────────────────────────────────────────┤
│   🚨 실시간 할까말까 인기 질문                    │
│   [카톡][스타일][프로필][관계]                  │
│   질문 카드 3~4개                              │
├──────────────────────────────────────────────┤
│   📸 인기 어필 피드                             │
│   그리드 인스타 스타일                          │
├──────────────────────────────────────────────┤
│   💬 오늘의 팩폭                         │
│   자동 롤링 인용문                              │
├──────────────────────────────────────────────┤
│   ⭐ 이번 주 매력 남자                          │
│   성장 스토리 하이라이트                        │
├──────────────────────────────────────────────┤
│   [푸터 — 미션 문장 + 링크]                     │
└──────────────────────────────────────────────┘
```

## 하지 말 것

- ❌ Tailwind 색상 클래스 직접 사용
- ❌ 하드코딩 rgba
- ❌ 라이트 모드에서 액센트 배경 위 흰 텍스트 (대비 부족)
- ❌ 통화 페이지 화이트 배경
- ❌ 이모지 남발
- ❌ 여성 친구 실사 사진 노출
- ❌ 결제 CTA에 붉은 색 (긴급/위험 뉘앙스)

## 관련 스킬

- [[brand-charming]] — 브랜드 무드
- [[panel-persona]] — 캐릭터 이미지 스타일
- [[lifecycle]] — 스테이지별 위젯
- [[concept]] — 페이지별 레이아웃
