# 챠밍 (Charming)

> 어색함이 자신감이 되고, 자신감이 인연이 되는 곳.

챠밍은 남성 유저가 여성 친구와 대화하며 여자와 편안하게 대화하는 근육을 키우고,  
실제 연애·결혼, 그 이후의 관계까지 잘 해나갈 수 있도록 돕는 **평생 놀이터**입니다.

## 진입점

- 개발 가이드: [`CLAUDE.md`](CLAUDE.md)
- 문서 맵: [`AGENTS.md`](AGENTS.md)
- 스킬 (개발 시 필참): [`.claude/skills/`](.claude/skills/)
- 개발 셋업: [`docs/engineering/dev-setup.md`](docs/engineering/dev-setup.md)

## 스택

- **Backend**: FastAPI · Supabase · OpenAI (Whisper + GPT) · WebRTC (Socket.IO)
- **Frontend**: Next.js 15 · TypeScript · Tailwind v4
- **Infra**: Docker Compose · Vercel · Fly.io

## 로컬 실행

```bash
# 프론트
cd frontend && npm install && npm run dev

# 백엔드
cd backend && python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # 값 채우기
uvicorn main:app --reload --port 8000

# 통합
docker compose up --build
```

## 라이선스

Private. 챠밍 오리지널.
