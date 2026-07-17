import { ThreadListSection } from "@/features/mypage/components/ThreadListSection";
import { readRoleFromSearchParams } from "@/features/mypage/lib/role";
import {
  getCreatorThreadSummaries,
  getUserThreadSummaries,
} from "@/features/mypage/lib/selectors";
import { creatorsMock } from "@/shared/lib/mock";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ThreadsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const role = readRoleFromSearchParams(sp);

  if (role === "creator") {
    const me = creatorsMock[0];
    const summaries = getCreatorThreadSummaries(me.id);
    return (
      <ThreadListSection
        title="내 상대들"
        subtitle="지금 봐주고 있는 오빠들이야. 회차가 쌓일수록 성장이 잘 보여."
        summaries={summaries}
        viewer="creator"
        prioritizeFeedback
      />
    );
  }

  const summaries = getUserThreadSummaries();
  return (
    <ThreadListSection
      title="내 소개팅"
      subtitle="지금까지 만난 여사친들과의 여정이야. 카드 눌러서 회차 히스토리 봐."
      summaries={summaries}
      viewer="user"
    />
  );
}
