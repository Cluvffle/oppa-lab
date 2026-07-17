# 개발 환경 셋업

챠밍 로컬 개발 환경 구성 가이드.

## 요구사항

- **Node.js**: 20 LTS 이상
- **Python**: 3.11 이상
- **Docker**: (선택) 통합 실행용
- **Supabase 프로젝트**: 개발용 별도 프로젝트 생성 권장
- **OpenAI API 키**: Whisper + GPT 사용

## 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

기본 포트: `http://localhost:3001`

## 백엔드 실행

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # 값 채우기
uvicorn main:app --reload --port 8000
```

기본 포트: `http://localhost:8000`
Swagger UI: `http://localhost:8000/docs`

## Docker Compose 통합 실행

```bash
docker compose up --build
```

## 환경변수

- `frontend/.env.local` — Next.js 프론트 (NEXT_PUBLIC_* 접두)
- `backend/.env` — FastAPI 백엔드

## 참조 문서

- 도메인 모델: [.claude/skills/domain-model/SKILL.md](../../.claude/skills/domain-model/SKILL.md)
- 디자인 시스템: [.claude/skills/design-system/SKILL.md](../../.claude/skills/design-system/SKILL.md)
- 서비스 컨셉: [.claude/skills/concept/SKILL.md](../../.claude/skills/concept/SKILL.md)
