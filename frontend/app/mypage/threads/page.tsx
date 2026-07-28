import { Suspense } from "react";
import { ThreadsWorkspace } from "@/features/mypage/components/ThreadsWorkspace";
import { readRoleFromSearchParams } from "@/features/mypage/lib/role";
import {
  getCreatorThreadListItems,
  getUserThreadListItems,
} from "@/features/mypage/lib/selectors";
import { creatorsMock } from "@/shared/lib/mock";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ThreadsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const role = readRoleFromSearchParams(sp);

  const items =
    role === "creator"
      ? getCreatorThreadListItems(creatorsMock[0].id)
      : getUserThreadListItems();

  return (
    <Suspense fallback={<div className="threads-workspace" />}>
      <ThreadsWorkspace serverItems={items} viewer={role} />
    </Suspense>
  );
}
