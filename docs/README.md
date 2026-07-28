# 사이다 문서 (docs/)

프로젝트 전 영역 문서 4-bucket. 개발 참조 스킬은 [`.claude/skills/`](../.claude/skills/) 참조.

## 구조

| 폴더 | 내용 |
|---|---|
| [`product/`](product/) | 컨셉·요구사항·기획 (스킬로 이관 완료, 여기는 확장/변경 이력) |
| [`features/`](features/) | 구현된 기능별 명세 (`spec.md`, `api.md`, `flow.md`) — [[feature-doc]] 스킬로 자동 생성 |
| [`engineering/`](engineering/) | 개발 셋업, 컨벤션, 아키텍처 결정 |
| [`operations/`](operations/) | 배포, 모니터링, 인시던트 |

## 스킬 우선 규칙

**모든 개발 결정의 최상위 참조는 [`.claude/skills/`](../.claude/skills/) 문서.** `docs/`는 스킬에 없는 구체적 실행 문서(기능별 API, 배포 절차 등).
