---
name: domain-model
description: 챠밍 도메인 엔티티 · 필드 정의 · 관계도 · 용어집. DB 스키마 · API 설계 · TypeScript 타입 정의 시 단일 진실 공급원.
---

# Domain Model — 엔티티 & 용어집

궁극 목표는 [[mission]], 서비스 구조는 [[concept]] 참조. 이 문서는 코드에서 쓰이는 이름·타입·관계의 단일 진실 공급원이다.

## 관계도 (개요)

```
User (남성) ─┬─ Profile
             ├─ Stage (lifecycle 4단계)
             ├─ GrowthMetrics (5개 지표 시계열)
             ├─ FemaleNetwork (여성 네트워크)
             ├─ Badges
             ├─ Payments / Subscriptions
             ├─ EmergencyPosts (할까말까 질문)
             ├─ AppealPosts (어필 피드)
             └─ Community Posts/Comments

Creator (여성) ─┬─ CreatorProfile (닉네임, MBTI, 캐릭터)
                ├─ CreatorType (연습파트너/연애코치/관계상담사)
                ├─ Availability (온라인 상태 + 제공 티어 매트릭스 + 요일별 슬롯)
                ├─ Rating & Reviews
                ├─ PointsBalance (친구 리워드)
                ├─ Payouts (매칭 급여)
                ├─ EmergencyComments (할까말까 답변)
                └─ Community Posts/Comments

DatingThread (한 남성 ↔ 한 여성의 소개팅 여정)
             ├─ User ↔ Creator (1쌍 유일)
             ├─ Meets: DatingMeet[]         ← 회차별 만남
             ├─ AfterRequests               ← 다음 회차 신청 이력
             ├─ CoordinationChat            ← 예약 조율 채팅 (회차별 1개)
             └─ 카운터/최근 상태 캐시

DatingMeet (1회차 실제 만남)
             ├─ Thread (FK)
             ├─ Tier (voice/video/offline)
             ├─ MeetNumber (1,2,3…)         ← 스레드 내 순번
             ├─ Booking                     ← 예약 시각/장소
             ├─ CallSession?                ← voice/video일 때 실제 통화 세션
             ├─ AfterRequest? (이 회차를 낳은 신청)
             └─ Report (여사친 피드백 + AI 분석)

Report ─┬─ CreatorFeedback (템플릿)
        ├─ AIAnalysis (Whisper+GPT)
        ├─ MetricScores (5지표)
        └─ NextRecommendation

EmergencyPost ─┬─ Room (kakao/style/profile/relationship)
               ├─ Author (User only)
               ├─ Attachments (스샷/사진)
               ├─ Comments (Creator only)
               └─ HelpfulReactions

AppealPost ─┬─ Category (styling/expression/hair/voice/kakao)
            ├─ Author (User only)
            ├─ Media (사진/영상)
            ├─ FeedbackComments (Creator only)
            └─ GrowthPair (before/after 링크)

CommunityPost ─┬─ Board (자유/졸업생/부부/오답노트/성장일지 등)
               ├─ Author (User or Creator or Admin)
               ├─ Comments
               └─ Reactions
```

## 남성 유저 엔티티

### `User`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | Supabase Auth user_id |
| `nickname` | string | ✅ | 자유 닉네임 (여성 호칭 사칭 필터링) |
| `email` | string | ✅ | Supabase Auth |
| `stage` | enum | ✅ | `rookie` / `growing` / `challenger` / `grad_plus` |
| `stage_changed_at` | timestamp | ✅ | 현 스테이지 진입 시각 |
| `age` | int | ✅ | 20세 이상 |
| `height_cm` | int | ✅ | |
| `occupation` | string | ✅ | 직업 카테고리 |
| `region` | string | ✅ | 시/도 |
| `bio` | text | — | 자기소개 |
| `photo_url` | string | — | 프로필 사진 |
| `photo_public` | bool | ✅ | 기본 false |
| `adult_verified` | bool | ✅ | 본인인증 완료 |
| `relationship_status` | enum | — | `single` / `dating` / `married` (Grad+ 세분화) |
| `created_at` | timestamp | ✅ | |

라이프사이클 상세는 [[lifecycle]] 참조.

### `FemaleNetworkEntry` (남성 유저의 여성 네트워크 기록)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | FK → User |
| `creator_id` | UUID | FK → Creator |
| `first_talked_at` | timestamp | 첫 대화 시각 |
| `last_talked_at` | timestamp | |
| `total_calls` | int | 통화 횟수 |
| `is_favorite` | bool | 지명 관계 여부 |
| `nickname_by_user` | string | 유저가 이 친구를 뭐라고 부르는지 (예: "커피누나") |

**동일 유저·친구 조합에 유일**. 반복 대화 시 계속 업데이트.

### `Badge`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | |
| `badge_type` | enum | 배지 종류 (`first_step`, `three_in_a_row`, `growth_king`, `graduate` 등) |
| `unlocked_at` | timestamp | |

배지 종류는 [[growth-metrics]] 참조.

## 여성 친구 엔티티

### `Creator`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `nickname` | string | ✅ | 활동 닉네임 (실명 X) |
| `email` | string | ✅ | Supabase Auth |
| `creator_type` | enum | ✅ | `practice_partner` / `love_coach` / `relationship_advisor` |
| `age` | int | ✅ | 실제 나이 |
| `age_group` | enum | ✅ | `early_20s` / `late_20s` / `early_30s` / `late_30s_plus` |
| `occupation` | string | ✅ | |
| `mbti` | string(4) | ✅ | 예: `ENFP` |
| `personality_tags` | string[] | ✅ | 최대 3개 |
| `bio` | text | ✅ | 자기소개 한 줄 |
| `character_style_id` | string | ✅ | PixelLab 캐릭터 스타일 참조 |
| `character_image_url` | string | ✅ | 생성된 캐릭터 이미지 |
| `character_expressions` | json | ✅ | `{ neutral, smile, serious }` URL 3개 |
| `is_online` | bool | ✅ | 실시간 상태 |
| `is_available_for_call` | bool | ✅ | 통화 매칭 가능 여부 (일반 활동만 하는 회원은 false) |
| `avg_rating` | float | — | 0~5 |
| `total_calls_completed` | int | — | 누적 완료 통화 |
| `total_users_helped` | int | — | 도움 받은 남성 유저 수 |
| `status` | enum | ✅ | `pending` / `active` / `suspended` |
| `adult_verified` | bool | ✅ | 본인인증 |
| `screening_passed_at` | timestamp | — | 스크리닝 통과 시각 |
| `created_at` | timestamp | ✅ | |

친구 유형별 세부 규칙은 [[panel-persona]] 참조.

### `CreatorAvailability` (제공 매트릭스 & 슬롯)

여사친이 **어떤 티어까지** 제공할 수 있고, **언제/어디서** 가능한지를 표현. `Creator` 와 1:1.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `creator_id` | UUID | ✅ | PK & FK |
| `offers_voice` | bool | ✅ | 전화 제공 여부 |
| `offers_video` | bool | ✅ | 화상 제공 여부 |
| `offers_offline` | bool | ✅ | 오프라인 만남 제공 여부 |
| `offline_regions` | string[] | — | 만남 가능 지역 (예: `["서울 강남", "서울 홍대"]`) — `offers_offline=true` 일 때만 |
| `weekly_slots` | json | ✅ | 요일별 가능 시간대 `{ mon: [{start,end}], tue: […], … }` |
| `response_speed` | enum | ✅ | `fast` / `normal` / `slow` — 조율 채팅 응답 속도 배지 |
| `updated_at` | timestamp | ✅ | |

**규칙**:
- 제공 안 하는 티어는 유저의 신청 UI에서 **비활성**. 우회 신청은 서버에서도 거부.
- 오프라인은 지역이 최소 1개 있어야 함.
- 슬롯이 비면 자동으로 `is_available_for_call = false` 취급.

### `CreatorPointsLedger` (포인트 원장)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `creator_id` | UUID | |
| `delta` | int | +/- 포인트 |
| `reason` | enum | `emergency_helpful` / `emergency_adopted` / `appeal_feedback` / `community_answer` / `payout_converted` |
| `reference_id` | UUID | 관련 게시글/댓글 ID |
| `balance_after` | int | 트랜잭션 후 잔액 |
| `created_at` | timestamp | |

세부는 [[creator-economy]] 참조.

### `Payout`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `creator_id` | UUID | |
| `call_session_id` | UUID | (매칭 급여인 경우) |
| `points_converted` | int | (포인트 전환인 경우) |
| `amount_krw` | int | 원 단위 |
| `provider` | enum | `bank_transfer` / `giftcard` |
| `status` | enum | `pending` / `paid` / `failed` |
| `paid_at` | timestamp | |

## 소개팅 여정 엔티티 (Thread / Meet / AfterRequest / Booking / Chat)

**철학**: 소개팅은 1회성이 아니라 **애프터가 이어지는 여정**이다. 한 남성-여성 페어의 모든 회차를 하나의 `DatingThread` 로 묶는다. 스킬 `[[mission]]` 의 "관계 진화" 원칙을 데이터 구조로 표현.

- **거절권 없음**: 오빠가 애프터 신청 시 여사친은 자동 수락 (결제 방어). 대신 여사친은 자신의 `Availability` 로 제공 티어를 통제하고, 조율 채팅에서 시간·장소를 조정하며, 위반 시 `AbuseReport` 트랙으로 차단.
- **회차 상한**: 스레드 회차 총량은 `[[mission]]` 의 지명 통화 월 상한과 연동 (기본 월 3회, 정책은 별도 config).
- **채팅 폐쇄 원칙**: 조율 채팅은 **회차별 1개**로 열리고 예약 확정 시 read-only. 사후 자유 채팅 없음 → 유사연애/집착 방지.

### `DatingThread`

한 유저 ↔ 한 크리에이터 페어의 소개팅 여정. 페어당 유일.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `user_id` | UUID | ✅ | FK → User |
| `creator_id` | UUID | ✅ | FK → Creator |
| `status` | enum | ✅ | `active` / `paused` / `closed_by_user` / `closed_by_creator` / `closed_by_moderation` |
| `voice_count` | int | ✅ | 완료된 voice 회차 수 (캐시) |
| `video_count` | int | ✅ | 완료된 video 회차 수 |
| `offline_count` | int | ✅ | 완료된 offline 회차 수 |
| `last_meet_at` | timestamp | — | 최근 완료 회차 시각 |
| `last_meet_tier` | enum | — | 최근 완료 회차 티어 |
| `next_pending_meet_id` | UUID | — | 아직 안 끝난 예약된 회차 (있으면 새 신청 불가) |
| `created_at` | timestamp | ✅ | 스레드 최초 개시 (첫 신청) |
| `closed_at` | timestamp | — | |

**유니크 제약**: `(user_id, creator_id)` 유일.

**월 상한 계산**: 유저별 `(voice_count + video_count + offline_count)` 를 최근 30일 창으로 집계, `[[mission]]` 상한 룰과 비교.

### `AfterRequest` (애프터 신청)

오빠가 다음 회차를 신청. 자동 수락되며, 조율 채팅 오픈의 트리거.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `thread_id` | UUID | ✅ | FK → DatingThread |
| `previous_meet_id` | UUID | — | 이 신청이 어떤 회차 이후에 나왔는지 (첫 신청이면 null) |
| `requested_tier` | enum | ✅ | 오빠가 원한 티어 `voice` / `video` / `offline` |
| `status` | enum | ✅ | `auto_accepted` / `scheduling` / `booked` / `canceled_by_user` / `canceled_by_system` |
| `message` | text | — | 신청 시 첨부 메시지 (선택) |
| `created_at` | timestamp | ✅ | |
| `booked_at` | timestamp | — | 예약 확정 시각 |

**서버 검증**:
- `requested_tier` 가 대상 크리에이터의 `CreatorAvailability.offers_*` 를 만족해야 함.
- 해당 스레드에 `next_pending_meet_id` 가 이미 있으면 신규 신청 거부 ("먼저 이번 만남을 마쳐야 해").
- 유저 월 상한 초과 시 거부.

### `Booking` (예약)

조율 채팅에서 합의된 실제 스케줄. 확정 즉시 `DatingMeet` 을 생성.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `after_request_id` | UUID | ✅ | FK → AfterRequest (1:1) |
| `meet_id` | UUID | — | 확정 시 생성된 DatingMeet ID |
| `tier` | enum | ✅ | 확정 티어 (신청 티어와 동일해야 함) |
| `scheduled_at` | timestamp | ✅ | 합의된 시각 |
| `location` | string | — | offline일 때만 (예: "서울 강남 스타벅스 강남R점") |
| `status` | enum | ✅ | `pending_agreement` / `confirmed` / `rescheduling` / `canceled` |
| `confirmed_at` | timestamp | — | 양측 확정 시각 |
| `canceled_reason` | enum | — | `no_agreement` / `user_canceled` / `creator_reported_conflict` / `no_show` |
| `updated_at` | timestamp | ✅ | |

**규칙**:
- `pending_agreement` → 조율 채팅 열려있음, 채팅 안에 "이 시간으로 확정" 액션이 있음.
- 확정은 **양측 클릭 확인** (미스매치 방지). 유저·크리에이터 중 한쪽만 확정하면 `pending_agreement` 유지.
- 확정 후 조율 채팅은 read-only.
- `scheduled_at` 도래 후 N분 (예: 15분) 지나도 통화 미접속 시 `no_show` 처리.

### `DatingMeet` (실제 회차)

Booking 확정 순간 생성. voice/video 는 완료 시 `CallSession` 과 연동, offline 은 만남 후 크리에이터가 완료 표시.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `thread_id` | UUID | ✅ | FK |
| `booking_id` | UUID | ✅ | FK (1:1) |
| `tier` | enum | ✅ | `voice` / `video` / `offline` |
| `meet_number` | int | ✅ | 스레드 내 순번 (1부터) |
| `status` | enum | ✅ | `scheduled` / `in_progress` / `completed` / `no_show` / `canceled` |
| `call_session_id` | UUID | — | voice/video일 때 실제 통화 세션 (offline은 null) |
| `report_id` | UUID | — | 완료 후 생성된 리포트 |
| `started_at` | timestamp | — | |
| `ended_at` | timestamp | — | |
| `created_at` | timestamp | ✅ | |

### `CoordinationChat` (조율 채팅)

애프터 신청 시 자동 개설. 사담 금지, 예약 확정 시 read-only.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `after_request_id` | UUID | ✅ | FK (1:1) |
| `thread_id` | UUID | ✅ | FK (조회 편의) |
| `status` | enum | ✅ | `open` / `readonly` / `archived` |
| `opened_at` | timestamp | ✅ | |
| `frozen_at` | timestamp | — | read-only 전환 시각 |

### `ChatMessage`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `chat_id` | UUID | ✅ | FK → CoordinationChat |
| `sender_type` | enum | ✅ | `user` / `creator` / `system` |
| `sender_id` | UUID | — | system은 null |
| `body` | text | ✅ | |
| `redacted_body` | text | — | 개인정보 마스킹 결과 (연락처/SNS ID 자동 치환) |
| `has_redaction` | bool | ✅ | 마스킹 발생 여부 |
| `proposal` | json | — | `{ scheduled_at, location? }` 시간 제안 시 첨부 |
| `is_proposal_accepted` | bool | — | 상대가 수락 클릭했는지 |
| `created_at` | timestamp | ✅ | |

**시스템 메시지 예**:
- 개설 시: "이 채팅은 소개팅 일정을 정하기 위한 공간이에요. 개인 연락처 교환은 자동 마스킹돼요."
- 확정 시: "3월 12일 19시, {장소} 로 예약이 확정됐어요."
- 만료 임박: "24시간 안에 시간이 확정되지 않으면 신청이 자동 취소돼요."

## 통화 & 리포트 엔티티

### `CallSession`

Meet 실행 단위. `DatingMeet.tier` 가 `voice`/`video` 일 때만 존재. offline 회차는 `CallSession` 없이 크리에이터가 만남 후 완료 처리.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `meet_id` | UUID | FK → DatingMeet (1:1) |
| `user_id` | UUID | FK (조회 편의) |
| `creator_id` | UUID | FK (조회 편의) |
| `tier` | enum | `voice` / `video` / `relationship_consult` (offline은 CallSession 미생성) |
| `status` | enum | `pending` / `matched` / `in_call` / `completed` / `cancelled` / `no_show` |
| `scheduled_at` | timestamp | 예약 시각 (Booking에서 복제) |
| `started_at` | timestamp | 실제 시작 |
| `ended_at` | timestamp | |
| `duration_sec` | int | |
| `recording_url` | string | Supabase Storage 경로 |
| `is_favorite_match` | bool | 지명 통화 여부 (스레드 2회차 이상이면 자동 true) |
| `price_paid_krw` | int | 결제된 금액 (원) |
| `payment_id` | UUID | FK → Payment |
| `webrtc_session_id` | string | WebRTC 세션 식별 |

### `Report`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `call_session_id` | UUID | FK |
| `creator_feedback` | json | `CreatorFeedback` 구조 |
| `ai_analysis` | json | `AIAnalysis` 구조 |
| `metric_scores` | json | 5개 지표 실제 점수 |
| `display_scores` | json | 5개 지표 화면 노출용 (스무딩 적용) |
| `next_recommendation` | text | AI 생성 다음 스텝 |
| `created_at` | timestamp | |

**`CreatorFeedback` 구조 (템플릿 강제)**:
```typescript
interface CreatorFeedback {
  strengths: string[3]         // 장점 3개 필수
  improvements: string[2]      // 아쉬운 점 2개 필수
  encouragement: string        // 응원 한 마디 필수
  favorite_moment?: string     // 선택
  metric_sliders: {            // 친구 점수 입력 (0~10)
    first_impression: number
    conversation: number
    manner: number
    appearance?: number        // 영상 통화 이상에서만
    confidence: number
  }
}
```

**`AIAnalysis` 구조**:
```typescript
interface AIAnalysis {
  talk_ratio: { user_pct: number, creator_pct: number }
  filler_words: { count: number, examples: string[] }
  silence_duration_sec: number
  reactions_per_min: number
  sentiment: 'positive' | 'neutral' | 'negative'
  self_deprecation_count: number
  key_moments: Array<{ timestamp: string, description: string }>
  transcript_url?: string
}
```

## 할까말까 엔티티

### `EmergencyPost`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `room` | enum | `kakao` / `style` / `profile` / `relationship` |
| `user_id` | UUID | 남성만 게시 |
| `title` | string | |
| `content` | text | |
| `attachments` | json | 이미지/영상 URL 배열 |
| `red_flag_detected` | bool | 관계 할까말까 자동 감지 |
| `red_flag_type` | enum | `violence` / `abuse` / `depression` / null |
| `status` | enum | `open` / `answered` / `closed` |
| `helpful_count` | int | |
| `created_at` | timestamp | |

### `EmergencyComment`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `post_id` | UUID | FK |
| `creator_id` | UUID | 여성만 댓글 가능 |
| `content` | json | 템플릿 구조 (see below) |
| `is_adopted` | bool | 게시자가 채택 |
| `helpful_by_user_ids` | UUID[] | 도움됨 클릭한 유저들 |
| `ai_tone_score` | float | 조롱/공격성 스코어 (0~1, 높을수록 문제) |
| `created_at` | timestamp | |

**댓글 템플릿 구조**:
```typescript
interface EmergencyCommentContent {
  positive_point: string       // 좋은 점 1가지 필수
  suggestion: string           // 개선 제안 1가지 필수
  example?: string             // 예시 (선택, 카톡 할까말까는 사실상 필수)
  encouragement?: string       // 응원 (선택)
}
```

할까말까별 세부 규칙은 [[emergency-rooms]] 참조.

## 어필 피드 엔티티

### `AppealPost`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | 남성만 |
| `category` | enum | `styling` / `expression` / `hair` / `voice` / `kakao` |
| `caption` | text | |
| `media_urls` | string[] | 이미지/영상 |
| `face_blur` | bool | 얼굴 블러 처리 여부 |
| `growth_pair_id` | UUID? | before/after 짝 참조 |
| `like_count` | int | (남성 유저는 좋아요/저장만 가능) |
| `feedback_comment_count` | int | (여성 친구 댓글) |
| `created_at` | timestamp | |

### `AppealFeedback` (어필 피드 댓글)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `appeal_post_id` | UUID | FK |
| `creator_id` | UUID | 여성만 |
| `content` | json | 할까말까 댓글 템플릿과 동일 |
| `ai_tone_score` | float | |
| `is_helpful_by_author` | bool | 게시자가 도움됨 클릭 |
| `created_at` | timestamp | |

세부는 [[appeal-feed]] 참조.

## 커뮤니티 엔티티

### `CommunityPost`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `board` | enum | 게시판 종류 (see below) |
| `author_type` | enum | `user` / `creator` / `admin` |
| `author_id` | UUID | |
| `title` | string | |
| `content` | text | |
| `attachments` | json | |
| `reactions` | json | `{ heart: n, cheer: n, hug: n }` |
| `is_pinned` | bool | 운영진 핀 |
| `board_specific_meta` | json | 게시판별 추가 필드 (졸업 인증의 경우 성공 스토리 등) |
| `created_at` | timestamp | |

**Board enum**:
```
free              — 솔로 라운지 (자유)
advice            — 고민상담소
qna               — Q&A
kakao_archive     — 카톡 할까말까 인기 아카이브
report_showcase   — 첫인상 리포트 인증
growth_log        — 오빠들의 성장일지
nunas_notes       — {{NUNA}}들의 오답노트 (UI 라벨은 별칭 확정 후 재조정)
real_interview    — 리얼 인터뷰
weekly_star       — 이번 주 매력 남자
grad_lounge       — 졸업생 라운지 (Grad+ 전용)
couple_lounge     — 부부 라운지 (기혼 전용)
```

세부는 [[community-rules]] 참조.

### `CommunityComment`

동일 구조로 부모 자식 관계 (`parent_id`)로 트리 지원.

## 성장 지표 엔티티

### `GrowthMetric`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | |
| `report_id` | UUID | 발생 원인 리포트 |
| `metric_type` | enum | `first_impression` / `conversation` / `manner` / `appearance` / `confidence` |
| `raw_score` | int | 0~100 실제 계산치 |
| `display_score` | int | 0~100 화면 노출용 (스무딩) |
| `recorded_at` | timestamp | |

세부는 [[growth-metrics]] 참조.

## 결제 엔티티

### `Payment`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | |
| `call_session_id` | UUID? | 단건 결제 |
| `subscription_id` | UUID? | 구독 결제 |
| `provider` | enum | `toss` (초기), 향후 `kakao_pay`, `naver_pay` |
| `product_code` | enum | `voice_call` / `video_call` / `offline_call` / `relationship_consult` / `kakao_script` / `complete_course` / `light_care` |
| `amount_krw` | int | |
| `status` | enum | `pending` / `succeeded` / `failed` / `refunded` |
| `provider_payment_key` | string | 토스 등 결제 키 |
| `created_at` | timestamp | |

### `Subscription`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | |
| `plan_code` | enum | `complete_course_199k` / `light_care_29k` |
| `status` | enum | `active` / `cancelled` / `expired` / `paused` |
| `started_at` | timestamp | |
| `next_billing_at` | timestamp | |
| `cancelled_at` | timestamp? | |

## 신고 · 모더레이션

### `Report` (모더레이션 신고 — 위 `Report`(리포트)와 이름 충돌 유의)

**주의**: 리포트 엔티티는 `Report`, 신고는 `AbuseReport` 로 명명해서 충돌 피함.

### `AbuseReport`

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | UUID | |
| `reporter_id` | UUID | |
| `reporter_type` | enum | `user` / `creator` |
| `target_type` | enum | `user` / `creator` / `post` / `comment` |
| `target_id` | UUID | |
| `reason` | enum | `harassment` / `sexual` / `stalking` / `off_platform_contact` / `spam` / `other` |
| `description` | text | |
| `status` | enum | `open` / `under_review` / `resolved` / `dismissed` |
| `created_at` | timestamp | |

## 용어집 (한 · 영 표준)

| 한글 | 코드 표준 | 대체 금지어 |
|---|---|---|
| 남성 유저 | `user` | ~~회원, 고객~~ |
| 여성 친구 | `creator` | ~~여자, 알바, 상담원, 패널~~ (내부 코드는 통일) |
| 여성 친구 유형 | `creator_type` | — |
| 연습 파트너 | `practice_partner` | — |
| 연애 코치 | `love_coach` | — |
| 관계 상담사 | `relationship_advisor` | — |
| 라이프사이클 단계 | `stage` | — |
| 입문기 | `rookie` | — |
| 성장기 | `growing` | — |
| 연애 도전기 | `challenger` | — |
| 연애/기혼기 | `grad_plus` | — |
| 소개팅 여정 | `dating_thread` | ~~히스토리, 관계~~ (여정 = 한 페어의 애프터 체인) |
| 회차 | `dating_meet` | ~~약속, 세션~~ (스레드 안의 1회 만남 단위) |
| 애프터 신청 | `after_request` | ~~재신청, 재예약~~ |
| 예약 | `booking` | ~~스케줄~~ (조율 채팅에서 확정된 시각+장소) |
| 조율 채팅 | `coordination_chat` | ~~DM, 메시지~~ (사담 금지 · 회차별 1개 · 확정 시 read-only) |
| 제공 티어 | `offers_*` | — (여사친이 제공 가능한 티어 매트릭스) |
| 통화 세션 | `call_session` | ~~미팅, 콜~~ (Meet 하위의 실행 단위) |
| 리포트 | `report` | ~~후기, 평가~~ |
| 지명 | `favorite_match` | — (스레드 2회차 이상이면 자동) |
| 할까말까 | `emergency_room` | ~~상담실~~ |
| 어필 피드 | `appeal_feed` | ~~자랑 피드~~ |
| 여성 네트워크 | `female_network` | ~~하렘, 목록~~ |
| 여사친 (개념) | `favorite_female_friend` | 도메인 개념. UI 라벨은 `{{NUNA}}` 별칭 확정 후 대체 (예: "내 도토리들") |
| 배지 | `badge` | — |
| 졸업 | `graduation` | ~~탈퇴, 만료~~ |
| 친구 포인트 | `creator_points` | ~~적립금~~ |

## 명명 규칙

- **DB 컬럼**: `snake_case`, 시간 필드는 `_at` 접미
- **API JSON**: `snake_case` (백엔드) → 프론트에서 필요시 `camelCase` 변환
- **TypeScript 인터페이스**: `PascalCase` (예: `Creator`, `CallSession`, `EmergencyPost`)
- **React 컴포넌트**: `PascalCase` (예: `CreatorCard`, `EmergencyRoomFeed`, `GrowthDashboard`)
- **enum 값**: `snake_case` (예: `rookie`, `practice_partner`)

## 관련 스킬

- [[mission]] — 왜 이 엔티티들이 존재하는가
- [[concept]] — 전체 구조
- [[lifecycle]] — Stage 필드 상세
- [[panel-persona]] — Creator 유형 규칙
- [[emergency-rooms]] — EmergencyPost/Comment 상세
- [[appeal-feed]] — AppealPost 상세
- [[creator-economy]] — Points/Payout 상세
- [[growth-metrics]] — Metric 계산
- [[community-rules]] — Board 상세
