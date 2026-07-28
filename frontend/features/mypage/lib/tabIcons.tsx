import type { ComponentType } from "react";
import { FileText, Heart, Coins, Settings as SettingsIcon } from "lucide-react";
import {
  ThreadsGlassIcon,
  GrowthGlassIcon,
  EmergencyGlassIcon,
  BillingGlassIcon,
  TodoGlassIcon,
  ScheduleGlassIcon,
  PayoutGlassIcon,
  ActivityGlassIcon,
} from "@/shared/ui/MypageIcons";
import type { MypageTabKey } from "./tabs";

type IconComp = ComponentType<{ size?: number }>;

// lucide 아이콘을 glass 아이콘 시그니처(size?) 로 래핑
const wrap = (Comp: React.ComponentType<{ size?: number; strokeWidth?: number }>): IconComp =>
  function Wrapped({ size = 20 }: { size?: number }) {
    return <Comp size={size} strokeWidth={1.8} />;
  };

export const TAB_ICON: Record<MypageTabKey, IconComp> = {
  // 오빠 유저 신 서비스
  posts: wrap(FileText),
  liked: wrap(Heart),
  sweetpotato: wrap(Coins),
  settings: wrap(SettingsIcon),
  // 기존 사이다친구/구 오빠 탭
  threads: ThreadsGlassIcon,
  growth: GrowthGlassIcon,
  emergency: EmergencyGlassIcon,
  billing: BillingGlassIcon,
  todo: TodoGlassIcon,
  schedule: ScheduleGlassIcon,
  payout: PayoutGlassIcon,
  activity: ActivityGlassIcon,
};
