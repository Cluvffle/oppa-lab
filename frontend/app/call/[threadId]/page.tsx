"use client";

import { use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CallRoom } from "@/features/call/components/CallRoom";
import { getThreadSummaryById } from "@/features/mypage/lib/selectors";
import { CURRENT_USER_ID } from "@/shared/lib/mock";

interface Props {
  params: Promise<{ threadId: string }>;
}

export default function CallPage({ params }: Props) {
  const { threadId } = use(params);
  const sp = useSearchParams();
  const role = sp?.get("role") === "creator" ? "creator" : "user";

  const summary = useMemo(() => getThreadSummaryById(threadId), [threadId]);

  if (!summary) {
    return (
      <main className="call-room">
        <div className="call-room__stage">
          <div className="call-room__peer">스레드를 찾을 수 없어.</div>
        </div>
      </main>
    );
  }

  // mock: 오빠 뷰면 상대는 여성 친구, 여성 뷰면 상대는 오빠(익명).
  const peerLabel =
    role === "creator" ? "익명 오빠" : summary.creator.nickname;
  const selfLabel = role === "creator" ? summary.creator.nickname : "익명 오빠";
  const userId = role === "creator" ? summary.creator.id : CURRENT_USER_ID;
  const backHref = `/mypage/threads/${threadId}${role === "creator" ? "?role=creator" : ""}`;

  return (
    <CallRoom
      threadId={threadId}
      userId={userId}
      peerLabel={peerLabel}
      selfLabel={selfLabel}
      backHref={backHref}
    />
  );
}
