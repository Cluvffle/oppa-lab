"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, MicOff, PhoneOff, ArrowLeft } from "lucide-react";
import { useWebRTC, type CallStatus } from "../hooks/useWebRTC";
import { cn } from "@/shared/lib/cn";

interface Props {
  threadId: string;
  userId: string;
  /** 상대(반대편) 표시용 라벨. 오빠 화면이면 사이다 친구 닉네임, 반대는 오빠 별칭. */
  peerLabel: string;
  /** 나 자신의 라벨. */
  selfLabel: string;
  /** 통화 종료 후 돌아갈 경로. */
  backHref: string;
}

const STATUS_TEXT: Record<CallStatus, string> = {
  idle: "준비 중...",
  requesting_media: "마이크 권한 요청 중...",
  connecting: "시그널링 연결 중...",
  waiting_peer: "상대 접속 대기 중...",
  connected: "연결됨",
  peer_left: "상대가 나갔어",
  failed: "연결 실패",
};

export function CallRoom({ threadId, userId, peerLabel, selfLabel, backHref }: Props) {
  const router = useRouter();
  const { status, error, remoteStream, muted, toggleMute, hangup } = useWebRTC({
    threadId,
    userId,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch(() => {
        // 자동재생 정책 걸릴 수 있음 — 유저 상호작용 후 재시도 필요
      });
    }
  }, [remoteStream]);

  const onHangup = () => {
    hangup();
    router.push(backHref);
  };

  const connected = status === "connected";

  return (
    <main className="call-room">
      <header className="call-room__head">
        <Link href={backHref} className="call-room__back" aria-label="뒤로">
          <ArrowLeft size={20} />
        </Link>
        <div className="call-room__title">
          <span className="call-room__title-label">1:1 목소리 통화</span>
          <span className="call-room__title-thread">thread · {threadId}</span>
        </div>
      </header>

      <section className="call-room__stage">
        <div className={cn("call-room__avatar-wrap", connected && "call-room__avatar-wrap--on")}>
          <div className="call-room__avatar" aria-hidden>
            {peerLabel.slice(0, 1)}
          </div>
          {connected && <span className="call-room__ring" aria-hidden />}
        </div>
        <div className="call-room__peer">{peerLabel}</div>
        <div
          className={cn(
            "call-room__status",
            status === "connected" && "call-room__status--good",
            (status === "failed" || status === "peer_left") && "call-room__status--bad"
          )}
        >
          {STATUS_TEXT[status]}
          {error && <span className="call-room__err"> · {error}</span>}
        </div>

        <div className="call-room__self">
          나 · {selfLabel} {muted && "(마이크 OFF)"}
        </div>
      </section>

      <audio ref={audioRef} autoPlay playsInline />

      <footer className="call-room__controls">
        <button
          type="button"
          className={cn("call-room__btn", muted && "call-room__btn--muted")}
          onClick={toggleMute}
          disabled={status !== "connected" && status !== "waiting_peer"}
          aria-label={muted ? "마이크 켜기" : "마이크 끄기"}
        >
          {muted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        <button
          type="button"
          className="call-room__btn call-room__btn--hangup"
          onClick={onHangup}
          aria-label="통화 종료"
        >
          <PhoneOff size={22} />
        </button>
      </footer>
    </main>
  );
}
