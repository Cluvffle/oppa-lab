---
name: git-flow
description: 새 작업 시작 시 브랜치 생성 → 커밋 → push → PR. "브랜치 따고 PR", "리뷰 요청", "PR 만들어줘", "feature 브랜치 시작" 등에 호출.
---

# git-flow — 브랜치·커밋·PR 표준

`main` 브랜치 직접 작업을 지양하고, **브랜치 → 커밋 → push → PR** 순서로 협업.

`/git-flow {요약}` 또는 자연어("브랜치 따서 작업하자", "PR 올려") 시 호출.

## 입력 수집

- **작업 요약** (필수) — 한 문장. 브랜치명·PR 제목에 사용
- **타입** — `feat` / `fix` / `chore` / `docs` / `refactor` / `style` / `test`
- **베이스 브랜치** — 기본 `main`

## 절차

### Step 1 — 현재 상태 점검

```bash
git status --short
git branch --show-current
```

- 현재 브랜치가 `main`이 **아닌** 경우 → 이미 작업 브랜치. Step 2 (브랜치 생성) 스킵.
- working tree 가 더러우면 (`M`/`??`) → 의도된 변경인지 확인. 의도된 변경이면 새 브랜치로 그대로 가져감 (`git switch -c` 가 보존).

### Step 2 — main 최신화 후 브랜치 생성

```bash
# clean 한 경우
git switch main
git pull --ff-only origin main
git switch -c {type}/{kebab-case-요약}

# main 에서 작업 중 변경이 있는 경우
git switch -c {type}/{kebab-case-요약}
```

**브랜치 네이밍 규칙**:
- 형식: `{type}/{kebab-case-영문}`
- 예: `feat/webrtc-call-page`, `fix/creator-card-mobile`, `docs/panel-persona-tone`
- 영문 kebab-case 권장 (한글 브랜치명 지양)
- type prefix 는 커밋 타입과 일치

### Step 3 — 커밋

Conventional Commits, 한글 메시지 허용.

```
{type}({scope}): {요약}

{선택 본문 — 변경 이유, 영향 범위}
```

**scope 표준**:
- `frontend` / `backend` / `docs` / `docker` / `db`
- 서브 도메인: `landing` / `dashboard` / `panels` / `call` / `emergency` / `feed` / `community` / `payment` / `auth`

**예시**:
```
feat(frontend/landing): 놀이터 홈 히어로 섹션 추가

- 지금 온라인 그리드 컴포넌트 (온라인 상태 여성 친구 목록)
- CreatorCard 반짝임 애니메이션
- 반응형 (모바일 2열 → 데스크탑 4열)
```

```
fix(backend/call): WebRTC 시그널링 재연결 로직 수정

Socket.IO 연결 끊김 시 자동 재시도가 무한 반복되는 문제 수정.
```

### Step 4 — Push

```bash
git push -u origin {브랜치명}
```

### Step 5 — PR 생성

```bash
gh pr create --title "{type}({scope}): {요약}" --body "$(cat <<'EOF'
## Summary
- 변경 내용 1
- 변경 내용 2

## Related
- 관련 스킬: [[skill-name]]
- 이슈: #123 (있다면)

## Test plan
- [ ] 로컬 개발 서버 실행 확인
- [ ] 모바일/데스크탑 반응형 확인
- [ ] 다크/라이트 토글 확인 (UI 변경 시)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## 커밋 원칙

- **작게 자주**: 논리적 단위 하나당 커밋 하나
- **명확한 메시지**: "왜" 를 본문에 담음
- **관련 스킬 참조**: 스킬 원칙에서 벗어난 결정이 있다면 커밋 본문에 명시

## 이슈 유형별 브랜치 예시

| 상황 | 브랜치 명 예시 |
|---|---|
| 새 기능 | `feat/emergency-room-relationship` |
| 버그 수정 | `fix/creator-card-mobile-layout` |
| 문서 작성 | `docs/skill-lifecycle-updated` |
| 스킬 개정 | `docs/skill-mission-graduation` |
| 리팩토링 | `refactor/growth-metric-calculation` |
| Docker/설정 | `chore/docker-compose-dev-hot-reload` |
| 스타일 | `style/design-system-dark-toggle` |
| 테스트 | `test/report-tone-filter` |

## 하지 말 것

- ❌ `main` 브랜치에 직접 push
- ❌ `--no-verify` 로 hook 건너뛰기 (원인 파악 후 해결)
- ❌ `-i` 옵션 (interactive) — Claude Code 지원 안 됨
- ❌ 여러 논리적 변경을 한 커밋에 뭉치기
- ❌ 커밋 메시지에 "wip", "temp", "fix stuff" 같은 무의미한 메시지

## 관련 스킬

- [[feature-doc]] — 기능 구현 후 문서 작성
