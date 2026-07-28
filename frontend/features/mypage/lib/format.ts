import { meetTierLabel, type MeetTier } from "@/shared/lib/mock";

/** "7/13 (일) 19:00" 형태 */
export function formatMeetDateTime(iso: string): string {
  const d = new Date(iso);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const wd = days[d.getDay()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} (${wd}) ${hh}:${mi}`;
}

/** "3일 전", "12시간 전", "방금" — 목업이라 now는 인자로 받아도 되고, 안 받으면 현재 */
export function formatRelativeTime(iso: string, now = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}주 전`;
  return `${Math.floor(day / 30)}달 전`;
}

export function meetTierIcon(t: MeetTier): string {
  switch (t) {
    case "voice":
      return "📞";
    case "offline":
      return "🤝";
  }
}

export function meetTierText(t: MeetTier): string {
  return meetTierLabel[t];
}
