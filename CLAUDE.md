# Claude — 챠밍 (Charming)

이 저장소에서 작업하는 Claude Code(claude.ai/code)를 위한 진입 문서.  
**모든 컨셉/설계 결정의 최상위 참조는 [`.claude/skills/`](.claude/skills/) 아래 스킬 문서.**

---

## 프로젝트 개요

**챠밍 (Charming)** — 남성 유저가 여성 친구와 대화하며 여자와 편안하게 대화하는 근육을 키우고, 실제 연애·결혼, 그 이후의 관계까지 잘 해나갈 수 있도록 돕는 **평생 놀이터**.

- 메인은 **결제 랜딩이 아니라 놀이터** (치지직 스타일)
- 3대 무료 할까말까 (카톡/스타일/프로필/관계) + 어필 피드 + 여성 친구 매칭
- 남성 라이프사이클 4단계 (입문/성장/연애도전/Grad+) 전 구간 대응
- 여성은 조언자·연습 파트너·관계 상담사 (상품 X)

> 이전 컨셉명(구 브랜드)은 **완전 폐기**됨. 관련 워딩은 사용 금지. 서비스명은 오직 **챠밍(Charming)** 으로만 표기.

---

## 빠른 진입

| 작업 | 진입 |
|---|---|
| 궁극 목표 재확인 | [`.claude/skills/mission/SKILL.md`](.claude/skills/mission/SKILL.md) |
| 서비스 전체 구조 | [`.claude/skills/concept/SKILL.md`](.claude/skills/concept/SKILL.md) |
| 도메인 엔티티 / 필드 / 용어 | [`.claude/skills/domain-model/SKILL.md`](.claude/skills/domain-model/SKILL.md) |
| 브랜드 톤 · 카피 규칙 | [`.claude/skills/brand-charming/SKILL.md`](.claude/skills/brand-charming/SKILL.md) |
| CSS 변수 · 블랙/화이트 토글 | [`.claude/skills/design-system/SKILL.md`](.claude/skills/design-system/SKILL.md) |
| 라이프사이클 4단계 | [`.claude/skills/lifecycle/SKILL.md`](.claude/skills/lifecycle/SKILL.md) |
| 여성 친구 규칙 | [`.claude/skills/panel-persona/SKILL.md`](.claude/skills/panel-persona/SKILL.md) |
| 4대 할까말까 | [`.claude/skills/emergency-rooms/SKILL.md`](.claude/skills/emergency-rooms/SKILL.md) |
| 어필 피드 | [`.claude/skills/appeal-feed/SKILL.md`](.claude/skills/appeal-feed/SKILL.md) |
| 여성 리워드 시스템 | [`.claude/skills/creator-economy/SKILL.md`](.claude/skills/creator-economy/SKILL.md) |
| 성장 지표 · 배지 · 졸업 | [`.claude/skills/growth-metrics/SKILL.md`](.claude/skills/growth-metrics/SKILL.md) |
| 커뮤니티 게시판 규칙 | [`.claude/skills/community-rules/SKILL.md`](.claude/skills/community-rules/SKILL.md) |
| 로컬 개발 셋업 | [`docs/engineering/dev-setup.md`](docs/engineering/dev-setup.md) |

---

## 폴더 구조

```
charming/                      ← 저장소 (실제 폴더명은 oppa-lab로 남아있음, 이력 보존 목적)
├── .claude/
│   ├── skills/                ← 개발 전 반드시 참조하는 스킬 14개
│   ├── hooks/
│   └── settings.local.json
├── backend/                   ← FastAPI (Python 3.11+)
│   ├── main.py
│   ├── app/
│   │   ├── core/              ← config, logging
│   │   ├── routers/           ← auth, users, creators, calls, reports, emergency, feed, community, billing
│   │   ├── services/          ← 도메인 로직
│   │   ├── models/            ← SQLAlchemy (Supabase Postgres)
│   │   ├── database/          ← migrations, seed
│   │   ├── llm/               ← Whisper STT + GPT 리포트 생성
│   │   ├── realtime/          ← WebRTC 시그널링 (Socket.IO)
│   │   ├── middleware/
│   │   ├── dependencies/
│   │   ├── policies/
│   │   ├── prompts/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/                  ← Next.js 15 + Tailwind v4
│   ├── app/                   ← App Router (놀이터 홈부터 리뉴얼)
│   ├── features/              ← 도메인별 (auth, panels, call, reports, community, dashboard, billing)
│   ├── shared/                ← ui, components, hooks, lib, layout
│   ├── styles/
│   ├── public/
│   ├── _legacy/               ← 구 서비스(설문/랜딩) 참조용, 리뉴얼 후 삭제 예정
│   └── package.json
├── docker/
│   ├── backend/Dockerfile
│   └── frontend/Dockerfile
├── docker-compose.yml
├── docs/                      ← product / features / engineering / operations
├── scripts/
├── AGENTS.md                  ← 문서 맵
├── CLAUDE.md                  ← 이 파일
└── README.md
```

---

## 기술 스택

- **Backend**: FastAPI · Supabase (Postgres + Auth + Storage) · OpenAI (Whisper + GPT-4o-mini) · Socket.IO WebRTC 시그널링 · 토스페이먼츠
- **Frontend**: Next.js 15 App Router · TypeScript · Tailwind v4 (CSS 변수 기반 테마) · shadcn/ui · TanStack Query · Zustand · simple-peer WebRTC · Framer Motion · Pretendard
- **Infra**: Docker Compose · Vercel(프론트) + Fly.io/자체(백엔드, TURN)

---

## 주요 명령어

### 프론트엔드
```bash
cd frontend
npm install
npm run dev      # 3001 포트
npm run build
npm run lint
```

### 백엔드
```bash
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # 값 채우기
uvicorn main:app --reload --port 8000
```

### Docker Compose
```bash
docker compose up --build
```

---

## 절대 룰 (스킬 요약)

1. **여성을 상품화하지 않는다** — 친구는 조언자·연습 파트너·관계 상담사
2. **조롱·팩폭 톤 금지** — 애정 어린 조언 톤만 (개별 친구 톤 4가지는 [[brand-charming]] 참조)
3. **유사연애/스토킹 방지** — 지명 통화 월 3~5회 상한, 사적 연락 금지
4. **남성 유저 완전 익명** — 성장 지표는 본인만 열람
5. **"졸업"은 이탈이 아니라 관계 진화** — Grad+ 유저를 놓치지 않는다
6. **놀이터 우선** — 홈은 결제 랜딩이 아니라 매일 놀러 오는 곳
7. **여성 친구 지속가능성 최우선** — 감정노동 상한 + 실질 보상 + 성취감
8. **회원 지칭은 챠밍 오리지널 별칭** — "누나", "여사친", "매니저" 지양. 별칭 확정 전까지 `{{OPPA}}` / `{{NUNA}}` 플레이스홀더. 상세는 [[brand-charming]]

전문은 [`.claude/skills/mission/SKILL.md`](.claude/skills/mission/SKILL.md) 참조.

---

## 스킬 (`.claude/skills/`)

| 스킬 | 용도 |
|---|---|
| `mission` | ⭐ 궁극 목표 · 절대 룰 (가장 먼저 읽음) |
| `concept` | 놀이터 · 4대 할까말까 · 매칭 · 커뮤니티 전체 구조 |
| `brand-charming` | 브랜드명 · 톤 · 카피 규칙 |
| `lifecycle` | 4단계 라이프사이클 · 진급 규칙 |
| `domain-model` | 엔티티 · 필드 · 용어집 |
| `design-system` | CSS 변수 · 컴포넌트 · 블랙/화이트 토글 |
| `panel-persona` | 여성 친구 3유형 규칙 |
| `emergency-rooms` | 4대 할까말까 상세 |
| `appeal-feed` | 어필 피드 · 성장 페어 |
| `creator-economy` | 친구 포인트 · 정산 · 세무 |
| `growth-metrics` | 5개 지표 · 배지 · 졸업 |
| `community-rules` | 게시판 · 모더레이션 |
| `git-flow` | 브랜치 · 커밋 · PR |
| `feature-doc` | 구현 후 docs/features/ 자동 생성 |

---

## 개발 원칙

- **새 기능 착수 전**: 관련 스킬 3~5개를 먼저 읽고 컨텍스트 확보
- **UI 컴포넌트**: Tailwind 색상 유틸 직접 사용 금지 → CSS 변수만
- **여성 관련 카피**: "여자", "매칭 상대", "회원님" 사용 금지
- **커밋**: `[[git-flow]]` 스킬 규칙 준수
- **기능 완료 후**: `/feature-doc {기능명}` 으로 docs/features 문서 생성

---

## 배포

Phase 1 (MVP): Vercel(프론트) + Fly.io(백엔드, WebRTC) · Supabase 클라우드  
Phase 2: 자체 인프라 검토 (트래픽/원가 기반)
