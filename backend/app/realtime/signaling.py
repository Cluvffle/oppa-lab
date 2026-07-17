"""
WebRTC 시그널링 (Socket.IO)

한 스레드(threadId) = 한 방(room). 최대 2인(오빠/여성 친구) 통화만 상정.
클라이언트 이벤트:
  - join            {threadId, userId}
  - webrtc:offer    {threadId, sdp}
  - webrtc:answer   {threadId, sdp}
  - webrtc:ice      {threadId, candidate}
  - leave           {threadId}

서버 브로드캐스트(방 안 상대에게):
  - peer-joined     {peerId}          # 두 번째 참가자가 붙었음을 첫 번째에게 알림
  - peer-left       {peerId}
  - webrtc:offer / :answer / :ice     # 반대편으로 그대로 릴레이

MVP 원칙:
- 인증 없음. 실 사용 붙이기 전에 JWT 검증 미들웨어 반드시 추가.
- 상태는 방별 { sid, userId } 페어 정도만 메모리 보관. 다중 인스턴스 배포 시엔
  Redis 어댑터(socketio.AsyncRedisManager) 로 교체.
"""

from __future__ import annotations

import socketio
from app.core.logging import get_logger

logger = get_logger(__name__)


# Public: main.py 에서 마운트할 ASGI 앱
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",  # dev 편의. prod 는 settings.CORS_ORIGINS 로 좁힘
    logger=False,
    engineio_logger=False,
)

# 방(threadId) → set[sid]
_rooms: dict[str, set[str]] = {}
# sid → {threadId, userId}
_sessions: dict[str, dict[str, str]] = {}


def _peers_in_room(thread_id: str, exclude_sid: str | None = None) -> list[str]:
    return [s for s in _rooms.get(thread_id, set()) if s != exclude_sid]


@sio.event
async def connect(sid: str, environ: dict, auth: dict | None = None) -> None:
    logger.info("sio_connect", sid=sid)


@sio.event
async def disconnect(sid: str) -> None:
    session = _sessions.pop(sid, None)
    if not session:
        return
    thread_id = session["threadId"]
    room = _rooms.get(thread_id)
    if room:
        room.discard(sid)
        if not room:
            _rooms.pop(thread_id, None)
    await sio.emit("peer-left", {"peerId": sid}, room=thread_id, skip_sid=sid)
    logger.info("sio_disconnect", sid=sid, thread=thread_id)


@sio.event
async def join(sid: str, data: dict) -> dict:
    thread_id = str(data.get("threadId") or "").strip()
    user_id = str(data.get("userId") or "").strip() or "anon"
    if not thread_id:
        return {"ok": False, "error": "threadId required"}

    room = _rooms.setdefault(thread_id, set())
    if len(room) >= 2 and sid not in room:
        return {"ok": False, "error": "room full"}

    room.add(sid)
    _sessions[sid] = {"threadId": thread_id, "userId": user_id}
    await sio.enter_room(sid, thread_id)

    peers = _peers_in_room(thread_id, exclude_sid=sid)
    # 방에 이미 있던 상대에게 새 참가자 알림
    await sio.emit("peer-joined", {"peerId": sid, "userId": user_id}, room=thread_id, skip_sid=sid)
    logger.info("sio_join", sid=sid, thread=thread_id, peers=len(peers))
    return {"ok": True, "peers": peers}


@sio.event
async def leave(sid: str, data: dict) -> None:
    thread_id = str(data.get("threadId") or "").strip()
    if not thread_id:
        return
    room = _rooms.get(thread_id)
    if room:
        room.discard(sid)
        if not room:
            _rooms.pop(thread_id, None)
    _sessions.pop(sid, None)
    await sio.leave_room(sid, thread_id)
    await sio.emit("peer-left", {"peerId": sid}, room=thread_id, skip_sid=sid)


async def _relay(event: str, sid: str, data: dict) -> None:
    thread_id = str(data.get("threadId") or "").strip()
    if not thread_id:
        return
    payload = {k: v for k, v in data.items() if k != "threadId"}
    payload["peerId"] = sid
    await sio.emit(event, payload, room=thread_id, skip_sid=sid)


@sio.on("webrtc:offer")
async def on_offer(sid: str, data: dict) -> None:
    await _relay("webrtc:offer", sid, data)


@sio.on("webrtc:answer")
async def on_answer(sid: str, data: dict) -> None:
    await _relay("webrtc:answer", sid, data)


@sio.on("webrtc:ice")
async def on_ice(sid: str, data: dict) -> None:
    await _relay("webrtc:ice", sid, data)


# main.py 에서 마운트할 ASGI 앱 (socketio_path 는 "/socket.io" 기본)
asgi_app = socketio.ASGIApp(sio, socketio_path="socket.io")
