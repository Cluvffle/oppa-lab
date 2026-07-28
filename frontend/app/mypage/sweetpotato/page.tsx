import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";
import { SweetPotatoPricing } from "@/features/mypage/components/SweetPotatoPricing";

export default function SweetPotatoPage() {
  return (
    <>
      <SegmentHeader
        title="고구마 관리"
        subtitle="사이다 화폐 단위 = 고구마. 가격표 · 충전 · 사용 내역."
      />
      <SweetPotatoPricing />
    </>
  );
}
