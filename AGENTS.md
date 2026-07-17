# AGENTS — 챠밍 문서 맵

이 저장소의 문서/스킬/코드 전체 지도. Claude Code · GPT · 사람 모두를 위한 진입점.

---

## 최상위 참조 순서

1. **[`.claude/skills/mission/SKILL.md`](.claude/skills/mission/SKILL.md)** — 궁극 목표
2. **[`.claude/skills/concept/SKILL.md`](.claude/skills/concept/SKILL.md)** — 서비스 구조
3. **[`CLAUDE.md`](CLAUDE.md)** — 개발 진입 문서

---

## 스킬 지도 (`.claude/skills/`)

### 정체성 (Identity)
- [`mission`](.claude/skills/mission/SKILL.md) — 궁극 목표 · 라이프사이클 철학 · 8가지 절대 룰
- [`concept`](.claude/skills/concept/SKILL.md) — 서비스 전체 구조 (놀이터 · 4대 할까말까 · 매칭 · 커뮤니티 · 대시보드)
- [`brand-charming`](.claude/skills/brand-charming/SKILL.md) — 브랜드명 · 톤 오브 보이스 · 카피 규칙
- [`lifecycle`](.claude/skills/lifecycle/SKILL.md) — 4단계 (입문/성장/도전/Grad+) · 진급 규칙

### 시스템 (System)
- [`domain-model`](.claude/skills/domain-model/SKILL.md) — 엔티티 · 필드 · 용어집
- [`design-system`](.claude/skills/design-system/SKILL.md) — CSS 변수 · 컴포넌트 · 블랙/화이트 토글

### 참여 채널 (Engagement)
- [`panel-persona`](.claude/skills/panel-persona/SKILL.md) — 여성 친구 3유형 (연습 파트너 · 연애 코치 · 관계 상담사)
- [`emergency-rooms`](.claude/skills/emergency-rooms/SKILL.md) — 4대 할까말까 (카톡 · 스타일 · 프로필 · 관계) + 레드플래그 필터
- [`appeal-feed`](.claude/skills/appeal-feed/SKILL.md) — 어필 피드 · 성장 페어 · 얼굴 노출 옵션
- [`creator-economy`](.claude/skills/creator-economy/SKILL.md) — 포인트 · 정산 · 세무 이슈

### 성장 · 커뮤니티 (Growth)
- [`growth-metrics`](.claude/skills/growth-metrics/SKILL.md) — 5개 지표 · 여성 네트워크 · 배지 · 졸업
- [`community-rules`](.claude/skills/community-rules/SKILL.md) — 게시판 · 모더레이션 · 라이프사이클 라운지

### 개발 (DevOps)
- [`git-flow`](.claude/skills/git-flow/SKILL.md) — 브랜치 · 커밋 · PR
- [`feature-doc`](.claude/skills/feature-doc/SKILL.md) — 기능 문서 자동 생성

---

## 코드 지도

### Backend (`backend/`)

```
main.py                    ← FastAPI 진입점
app/core/                  ← config · logging
app/routers/               ← auth · users · creators · calls · reports · emergency · feed · community · billing
app/services/              ← 도메인 로직 (users · panels · matching · calls · reports · community · billing · growth)
app/models/                ← SQLAlchemy (User · Creator · CallSession · Report · EmergencyPost · AppealPost · CommunityPost · Payment · Subscription · Badge · GrowthMetric · FemaleNetworkEntry · CreatorPointsLedger · Payout · AbuseReport)
app/database/migrations    ← Alembic
app/llm/                   ← Whisper STT · GPT 리포트 프롬프트
app/realtime/              ← WebRTC 시그널링 (Socket.IO)
app/middleware/            ← CORS · Logging · Auth
app/dependencies/          ← Depends 유틸
app/policies/              ← 통화 상한 · 커뮤니티 필터 · 레드플래그
app/prompts/               ← LLM 프롬프트 템플릿
app/utils/
```

### Frontend (`frontend/`)

```
app/                       ← Next.js App Router
  (marketing)/             ← 놀이터 홈, About
  (auth)/                  ← 로그인 · 가입 (남/여 트랙 분기)
  (main)/                  ← 로그인 후
    emergency/             ← 4대 할까말까
    feed/                  ← 어필 피드
    panels/                ← 친구 카탈로그
    call/[id]/             ← WebRTC 통화 페이지
    reports/               ← 리포트
    community/             ← 게시판
    dashboard/             ← 마이페이지 (성장 대시보드)
  api/                     ← BFF proxy → FastAPI
  globals.css              ← 챠밍 CSS 변수 시스템
  layout.tsx
features/                  ← 도메인별 (auth · panels · call · reports · emergency · feed · community · dashboard · billing · creator)
  {domain}/components/
  {domain}/hooks/
  {domain}/api/
  {domain}/types/
shared/
  ui/                      ← 원자 (Button · Card · Badge · Toggle · Avatar)
  components/              ← 조합
  hooks/
  lib/                     ← api client · utils
  layout/                  ← Header · Footer · Nav · ThemeToggle
styles/
public/
_legacy/                   ← 구 서비스 참조용, 리뉴얼 후 삭제
```

### Docker / Infra

```
docker/backend/Dockerfile
docker/frontend/Dockerfile
docker-compose.yml
```

### Docs

```
docs/product/              ← 컨셉 확장/변경 이력 (스킬 외 세부)
docs/features/{기능명}/    ← 구현된 기능별 spec/api/flow/files/logic
docs/engineering/          ← 개발 셋업 · 컨벤션 · 아키텍처 결정
docs/operations/           ← 배포 · 모니터링 · 인시던트
```

---

## 도메인 용어 한눈에 (한 · 영)

전체 목록은 [`domain-model`](.claude/skills/domain-model/SKILL.md#용어집-한--영-표준) 참조.

| 한글 | 코드 | 주의 |
|---|---|---|
| 남성 유저 | `user` | 회원/고객 X |
| 여성 친구 | `creator` | 여자/알바/상담원 X |
| 친구 유형 3종 | `practice_partner` · `love_coach` · `relationship_advisor` | |
| 라이프사이클 4단계 | `rookie` · `growing` · `challenger` · `grad_plus` | |
| 통화 세션 | `call_session` | |
| 리포트 | `report` (통화 후) / `abuse_report` (신고) | 이름 충돌 유의 |
| 할까말까 | `emergency_room` (`kakao` · `style` · `profile` · `relationship`) | |
| 어필 피드 | `appeal_feed` | |
| 여성 네트워크 | `female_network` | |
| 친구 포인트 | `creator_points` | 적립금 X |

---

## 절대 룰 요약

- 여성 상품화 X · 조롱 톤 X · 유사연애/스토킹 방지 · 남성 완전 익명 · 졸업은 관계 진화 · 놀이터 우선 · 친구 지속가능성 최우선
- 전문: [`mission`](.claude/skills/mission/SKILL.md)
