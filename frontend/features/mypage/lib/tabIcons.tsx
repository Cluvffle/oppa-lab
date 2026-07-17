import type { ComponentType } from "react";
import {
  ThreadsGlassIcon,
  GrowthGlassIcon,
  AppealGlassIcon,
  EmergencyGlassIcon,
  BillingGlassIcon,
  TodoGlassIcon,
  ScheduleGlassIcon,
  PayoutGlassIcon,
  ActivityGlassIcon,
} from "@/shared/ui/MypageIcons";
import type { MypageTabKey } from "./tabs";

type IconComp = ComponentType<{ size?: number }>;

export const TAB_ICON: Record<MypageTabKey, IconComp> = {
  threads: ThreadsGlassIcon,
  growth: GrowthGlassIcon,
  appeal: AppealGlassIcon,
  emergency: EmergencyGlassIcon,
  billing: BillingGlassIcon,
  todo: TodoGlassIcon,
  schedule: ScheduleGlassIcon,
  payout: PayoutGlassIcon,
  activity: ActivityGlassIcon,
};
