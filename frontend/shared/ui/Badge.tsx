import { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "default" | "accent" | "online";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  default: "badge",
  accent: "badge badge-accent",
  online: "badge badge-online",
};

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return <span className={cn(variantClass[variant], className)} {...props} />;
}
