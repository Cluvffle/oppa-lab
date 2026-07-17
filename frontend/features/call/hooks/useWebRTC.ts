"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import SimplePeer, { type Instance as PeerInstance, type SignalData } from "simple-peer";

/**
 * MVP WebRTC 훅 — 1:1 오디오 통화.
 *
 * 시그널링: 백엔드 Socket.IO (/socket.io). 방(room) = threadId.
 * ICE: STUN(Google public) + TURN(env 로 주입).
 *
 * 사용 흐름:
 *   const { status, remoteStream, muted, toggleMute, hangup } = useWebRTC({ threadId, userId });
 *   ref.current.srcObject = remoteStream;
 *
 * 라이프사이클:
 *   - mount → 마이크 요청 → 시그널링 접속 → join → peer 생성/응답
 *   - unmount → hangup 자동 호출 (mic track stop, peer destroy, socket disconnect)
 */

export type CallStatus =
  | "idle"
  | "requesting_media"
  | "connecting"
  | "waiting_peer"
  | "connected"
  | "peer_left"
  | "failed";

interface UseWebRTCOptions {
  threadId: string;
  userId: string;
  /** default: process.env.NEXT_PUBLIC_SIGNALING_URL || http://localhost:8000 */
  signalingUrl?: string;
}

interface UseWebRTCResult {
  status: CallStatus;
  error: string | null;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  muted: boolean;
  toggleMute: () => void;
  hangup: () => void;
}

const STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

/**
 * ICE 서버 구성.
 * 우선순위:
 *   1) NEXT_PUBLIC_TURN_API_URL 이 있으면 fetch → metered.ca REST 응답을 그대로 사용
 *   2) NEXT_PUBLIC_TURN_URL/USERNAME/CREDENTIAL 3개가 다 있으면 정적으로 추가
 *   3) 둘 다 없으면 STUN 만 (같은 네트워크에서만 통화 가능)
 */
async function buildIceServers(): Promise<RTCIceServer[]> {
  const apiUrl = process.env.NEXT_PUBLIC_TURN_API_URL;
  if (apiUrl) {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const relays: RTCIceServer[] = await res.json();
        return [...STUN_SERVERS, ...relays];
      }
      console.warn("[useWebRTC] TURN API non-ok:", res.status);
    } catch (e) {
      console.warn("[useWebRTC] TURN API fetch failed, falling back to STUN", e);
    }
  }

  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const turnUser = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const turnCred = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;
  if (turnUrl && turnUser && turnCred) {
    return [
      ...STUN_SERVERS,
      { urls: turnUrl, username: turnUser, credential: turnCred },
    ];
  }

  return STUN_SERVERS;
}

export function useWebRTC({
  threadId,
  userId,
  signalingUrl,
}: UseWebRTCOptions): UseWebRTCResult {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<PeerInstance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const initiatorRef = useRef<boolean>(false);
  const teardownRef = useRef<() => void>(() => {});

  const url =
    signalingUrl ||
    process.env.NEXT_PUBLIC_SIGNALING_URL ||
    "http://localhost:8000";

  // 정리 로직 (unmount / hangup 공통)
  const teardown = useCallback(() => {
    try {
      peerRef.current?.destroy();
    } catch {
      // ignore
    }
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (socketRef.current) {
      try {
        socketRef.current.emit("leave", { threadId });
      } catch {
        // ignore
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
  }, [threadId]);
  teardownRef.current = teardown;

  const hangup = useCallback(() => {
    teardown();
    setStatus("peer_left");
  }, [teardown]);

  const toggleMute = useCallback(() => {
    const s = localStreamRef.current;
    if (!s) return;
    const enabled = s.getAudioTracks().some((t) => t.enabled);
    s.getAudioTracks().forEach((t) => (t.enabled = !enabled));
    setMuted(enabled); // 새 값 (enabled 였다면 이제 muted=true)
  }, []);

  useEffect(() => {
    let disposed = false;

    async function start() {
      try {
        setStatus("requesting_media");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        if (disposed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);

        // ICE 서버는 시그널링 접속 전에 한 번 fetch (metered REST 또는 정적)
        const iceServers = await buildIceServers();
        if (disposed) return;

        setStatus("connecting");
        const socket = io(url, {
          transports: ["websocket"],
          path: "/socket.io",
        });
        socketRef.current = socket;

        const makePeer = (initiator: boolean) => {
          initiatorRef.current = initiator;
          const peer = new SimplePeer({
            initiator,
            trickle: true,
            stream,
            config: { iceServers },
          });
          peerRef.current = peer;

          peer.on("signal", (data: SignalData) => {
            // simple-peer 는 offer/answer/candidate 를 하나의 signal 이벤트로 뿌린다
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const kind = (data as any).type;
            if (kind === "offer") {
              socket.emit("webrtc:offer", { threadId, sdp: data });
            } else if (kind === "answer") {
              socket.emit("webrtc:answer", { threadId, sdp: data });
            } else {
              // ICE candidate 등
              socket.emit("webrtc:ice", { threadId, candidate: data });
            }
          });

          peer.on("stream", (remote: MediaStream) => {
            setRemoteStream(remote);
            setStatus("connected");
          });

          peer.on("connect", () => setStatus("connected"));
          peer.on("close", () => {
            if (!disposed) setStatus("peer_left");
          });
          peer.on("error", (err: Error) => {
            console.error("[useWebRTC] peer error", err);
            if (!disposed) {
              setError(err.message);
              setStatus("failed");
            }
          });
          return peer;
        };

        socket.on("connect", () => {
          socket.emit(
            "join",
            { threadId, userId },
            (ack: { ok: boolean; peers: string[]; error?: string }) => {
              if (!ack?.ok) {
                setError(ack?.error || "join failed");
                setStatus("failed");
                return;
              }
              // 상대가 이미 있으면 우리가 initiator (offer 보냄)
              if (ack.peers.length > 0) {
                makePeer(true);
              } else {
                setStatus("waiting_peer");
              }
            }
          );
        });

        socket.on("peer-joined", () => {
          // 우리가 먼저 들어와 있었고, 이제 상대가 붙음.
          // 이미 initiator 로 peer 를 만들었다면 스킵.
          if (peerRef.current) return;
          // 나는 waiter → 상대(initiator) 의 offer 가 오면 그때 peer 생성.
          // 굳이 여기서 미리 peer 를 만들 필요 없음. offer 수신 핸들러 참조.
        });

        socket.on("webrtc:offer", ({ sdp }: { sdp: SignalData }) => {
          if (!peerRef.current) {
            makePeer(false);
          }
          peerRef.current?.signal(sdp);
        });

        socket.on("webrtc:answer", ({ sdp }: { sdp: SignalData }) => {
          peerRef.current?.signal(sdp);
        });

        socket.on("webrtc:ice", ({ candidate }: { candidate: SignalData }) => {
          if (!peerRef.current) return;
          try {
            peerRef.current.signal(candidate);
          } catch (e) {
            console.warn("[useWebRTC] ice signal ignored", e);
          }
        });

        socket.on("peer-left", () => {
          if (!disposed) {
            setStatus("peer_left");
            try {
              peerRef.current?.destroy();
            } catch {
              // ignore
            }
            peerRef.current = null;
          }
        });

        socket.on("disconnect", () => {
          if (!disposed && status !== "peer_left") setStatus("peer_left");
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[useWebRTC] start failed", e);
        setError(msg);
        setStatus("failed");
      }
    }

    start();

    return () => {
      disposed = true;
      teardownRef.current();
    };
    // threadId/userId/url 이 바뀌면 새 세션을 잡는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, userId, url]);

  return {
    status,
    error,
    remoteStream,
    localStream,
    muted,
    toggleMute,
    hangup,
  };
}
