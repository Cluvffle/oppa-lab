import Image from "next/image";
import { cn } from "@/shared/lib/cn";

type Size = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  /** 나중에 실제 이미지가 생기면 이 URL로 교체. 없으면 placeholder. */
  src?: string | null;
  alt?: string;
  size?: Size;
  className?: string;
  ring?: boolean; // 온라인 상태 등 강조용 링
}

const sizeMap: Record<Size, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export function Avatar({
  src,
  alt = "프로필 이미지",
  size = "md",
  className,
  ring = false,
}: AvatarProps) {
  const px = sizeMap[size];
  return (
    <div
      className={cn("avatar", ring && "avatar--ring", className)}
      style={{ width: px, height: px }}
    >
      <Image
        src={src || "/avatar-placeholder.svg"}
        alt={alt}
        width={px}
        height={px}
        className="avatar__img"
      />
    </div>
  );
}
