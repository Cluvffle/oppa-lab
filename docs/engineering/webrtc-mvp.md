# WebRTC MVP — 1:1 오디오 통화

Phase 1 목표: **로컬 2탭에서 통화 → Fly.io + Vercel 프리뷰로 원격 페어 QA**.
비디오/녹음/STT/피드백은 이후 단계.

## 아키텍처

```
[브라우저 A] ── getUserMedia(audio) ──┐
                                      ├── simple-peer (WebRTC) ── P2P 오디오 스트림 ──► [브라우저 B]
[브라우저 B] ── getUserMedia(audio) ──┘
     │                                       │
     └────── Socket.IO 시그널링 ────────────┘
                     │
              [FastAPI (backend)]
                /socket.io 마운트
```

- 시그널링: `backend/app/realtime/signaling.py` (Socket.IO ASGI, room=`threadId`)
- 프론트 훅: `frontend/features/call/hooks/useWebRTC.ts`
- 통화 페이지: `frontend/app/call/[threadId]/page.tsx`
- 진입 CTA: `mypage/threads/[id]` 상단 "🎧 지금 목소리로"

## ICE 서버

STUN 은 Google public, TURN 은 [metered.ca](https://www.metered.ca/tools/openrelay/) 무료 500MB/월.

프론트 `.env.local`:
```
NEXT_PUBLIC_SIGNALING_URL=http://localhost:8000
NEXT_PUBLIC_TURN_URL=turn:global.relay.metered.ca:80
NEXT_PUBLIC_TURN_USERNAME=<metered_username>
NEXT_PUBLIC_TURN_CREDENTIAL=<metered_credential>
```
로컬 2탭 QA 만이면 TURN 은 비워둬도 됨(STUN 만으로 붙음).

## 로컬 실행

```bash
# 1) 백엔드
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000

# 2) 프론트
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_SIGNALING_URL=http://localhost:8000
npm install
npm run dev                  # :3001
```

브라우저 A: `http://localhost:3001/mypage/threads/t1` → "🎧 지금 목소리로"
브라우저 B(시크릿 창): `http://localhost:3001/mypage/threads/t1?role=creator` → "🎧 지금 목소리로"
→ 두 창 모두 "연결됨" 표시되고 오디오 흐름.

**주의**: 크롬은 http localhost 에서 getUserMedia 허용. 다른 IP 로 접속(예: LAN 폰) 시 https 필요 → 프리뷰 배포로 넘어감.

## 프리뷰 배포 (Fly.io + Vercel)

### Backend → Fly.io

```bash
cd backend
brew install flyctl && fly auth signup   # 카드 등록 필요(무과금)
fly launch --no-deploy                    # Dockerfile 감지 → charming-api 앱 생성
fly secrets set \
  INTERNAL_API_SECRET=... \
  JWT_SECRET=... \
  SUPABASE_URL=... SUPABASE_ANON_KEY=... \
  OPENAI_API_KEY=... \
  CORS_ORIGINS='["https://your-frontend.vercel.app"]'
fly deploy
```

`fly.toml` 에서 `internal_port = 8000` 확인. WebSocket 은 별도 설정 없이 통과.

### Frontend → Vercel

- 프로젝트 root 를 `frontend/` 로 지정
- Env vars:
  - `NEXT_PUBLIC_SIGNALING_URL=https://charming-api.fly.dev`
  - `NEXT_PUBLIC_TURN_URL`, `NEXT_PUBLIC_TURN_USERNAME`, `NEXT_PUBLIC_TURN_CREDENTIAL`
- 배포 → 프리뷰 URL 을 팀원에게 전달

## 원격 페어 QA 체크리스트

- [ ] 두 명이 같은 `threadId` 페이지에서 통화 버튼 클릭
- [ ] 각각 "연결됨" 상태 표시
- [ ] 마이크 ON/OFF 토글 시 상대에게 소리 끊김/재개
- [ ] 한쪽이 "종료" → 반대편 "상대가 나갔어" 표시
- [ ] 다른 캐리어(LTE ↔ Wi-Fi)에서도 붙는지 (TURN 필요할 확률 큼)

## 알려진 미구현 (다음 이터레이션)

- 인증(JWT) 시그널링 미들웨어 — 지금은 누구나 방 참가 가능
- 통화 세션 DB 기록 (start/end/tier) → `creator-economy` 정산 근거
- 지명 통화 월 3~5회 상한 서버 enforcement ([[mission]] 절대룰 3)
- Whisper STT + GPT 리포트 파이프라인
- 비디오 티어(`video`)
- 통화 후 자동 피드백 트리거
- TURN 트래픽 500MB 초과 대비 coturn 셀프호스팅

## 파일 참조

| 역할 | 경로 |
|---|---|
| 시그널링 | `backend/app/realtime/signaling.py` |
| ASGI 마운트 | `backend/main.py` (`app.mount("/socket.io", ...)`) |
| WebRTC 훅 | `frontend/features/call/hooks/useWebRTC.ts` |
| 통화 UI | `frontend/features/call/components/CallRoom.tsx` |
| 통화 페이지 | `frontend/app/call/[threadId]/page.tsx` |
| 진입 CTA | `frontend/app/mypage/threads/[id]/page.tsx` |
| CSS | `frontend/app/globals.css` (`.call-room*`, `.thread-detail__call-btn`) |
