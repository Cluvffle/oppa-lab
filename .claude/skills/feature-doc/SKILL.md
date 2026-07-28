---
name: feature-doc
description: 구현된 기능의 문서를 docs/features/{기능명}/ 에 생성. spec / api / data-model / flow / files 파일 작성. "이 기능 문서화해줘" 등에 호출.
---

# feature-doc — 기능 문서 자동 생성

`/feature-doc {기능명}` 호출 시 아래 절차.

## 입력 수집

- **기능명** — 커맨드 인자로 받거나 사용자에게 질문
- 참조 파일:
  - 관련 백엔드 라우터, 서비스, 모델
  - 관련 프론트엔드 컴포넌트, 훅, 타입
  - 관련 스킬 문서

## 작성 절차

### Step 1 — 코드 읽기

계획서와 실제 구현된 코드를 읽어 정보 파악:
- **백엔드**: 라우터 엔드포인트, 요청/응답 스키마, DB 저장 로직, 외부 API 호출
- **프론트엔드**: 컴포넌트 구조, 상태 관리, 데이터 흐름
- **타입**: TypeScript 인터페이스

### Step 2 — 파일 작성

```
docs/features/{기능명}/
├── spec.md        ← 기능 명세
├── api.md         ← API 엔드포인트
├── data-model.md  ← 관련 엔티티
├── flow.md        ← 사용자 흐름 다이어그램
├── files.md       ← 연관 파일 목록 (항상 생성)
└── logic.md       ← 복잡한 처리 알고리즘 있을 때만
```

> **logic.md 생성 조건** (아래 중 하나라도):
> - LLM (GPT/Whisper) 프롬프트 전략이 있는 경우
> - WebRTC 시그널링/미디어 처리
> - AI 톤 필터 등 비trivial 알고리즘
> - 지표 계산 스무딩 로직
> 
> 단순 CRUD는 생성 안 함.

## 파일별 작성 기준

### spec.md — 기능 명세

```markdown
# {기능명} — 기능 명세

## 개요
(이 기능이 무엇을 하는가, 한 단락)

## 관련 스킬
- [[skill-name]]

## 사용자 시나리오
(누가, 언제, 어떤 흐름으로 사용하는가)

1. 사용자가 ... 한다
2. 시스템이 ... 한다

## 라이프사이클 대상
- 입문기 / 성장기 / 연애 도전기 / Grad+ 중 어느 스테이지 대상인지

## 주요 상태
(상태 전이가 있다면)
| 상태 | 설명 |
|------|------|

## 제약 조건
(비즈니스 규칙, 예외 케이스)

## 미구현 / 향후 과제
```

### api.md — API 엔드포인트

```markdown
# {기능명} — API

## 엔드포인트 목록

### POST /api/{path}
- 목적:
- 인증: 필요 / 불필요
- 요청 스키마:
  ```typescript
  interface Request {
    field: type
  }
  ```
- 응답 스키마:
  ```typescript
  interface Response {
    field: type
  }
  ```
- 에러 코드:
  - `400`: 잘못된 요청
  - `401`: 인증 실패
```

### data-model.md — 관련 엔티티

- [[domain-model]] 참조
- 이 기능에서 새로 추가된 엔티티/필드 명시
- 관계도 (필요시 mermaid)

### flow.md — 사용자 흐름

```markdown
# {기능명} — Flow

## 프론트엔드 흐름

1. 사용자가 X 페이지 진입
2. Y 컴포넌트에서 Z 액션
3. API 호출 → 결과 표시

## 백엔드 흐름

1. 라우터 수신
2. 서비스 로직 실행
3. DB 저장 or 외부 호출
4. 응답

## 다이어그램 (mermaid)

    sequenceDiagram
      participant U as User
      participant F as Frontend
      participant B as Backend
      participant DB as Database
      
      U->>F: 액션
      F->>B: API 호출
      B->>DB: 저장
      DB-->>B: 결과
      B-->>F: 응답
      F-->>U: 화면 갱신
```

### files.md — 연관 파일 목록

```markdown
# {기능명} — Files

## 백엔드
- `backend/app/routers/xxx.py` — 라우터
- `backend/app/services/xxx.py` — 서비스
- `backend/app/models/xxx.py` — 모델

## 프론트엔드
- `frontend/app/xxx/page.tsx` — 페이지
- `frontend/features/xxx/components/YYY.tsx` — 컴포넌트
- `frontend/features/xxx/hooks/useZZZ.ts` — 훅
- `frontend/features/xxx/api/xxx.ts` — API 클라이언트

## 타입
- `frontend/types/xxx.ts` — 공통 타입
```

### logic.md — 알고리즘 (조건부)

```markdown
# {기능명} — Logic

## 알고리즘 개요
(핵심 알고리즘 한 단락)

## 상세 로직
- 입력:
- 처리 단계:
  1. Step 1
  2. Step 2
- 출력:

## 프롬프트 (LLM 사용 시)
    (전체 프롬프트 텍스트)

## 예외 케이스
- 실패 시 폴백
- 재시도 정책
```

## 문서 스킬 원칙 참조 규칙

각 문서에서 관련 스킬을 반드시 참조:

- 컨셉 관련 → [[concept]], [[mission]]
- 도메인 → [[domain-model]]
- UI/스타일 → [[design-system]], [[brand-cider]]
- 친구 → [[panel-persona]], [[creator-economy]]
- 지표 → [[growth-metrics]], [[lifecycle]]
- 할까말까/피드 → [[emergency-rooms]], 
- 커뮤니티 → [[community-rules]]

스킬과 어긋난 결정이 있다면 문서에 명시.

## 관련 스킬

- [[git-flow]] — 문서 커밋
