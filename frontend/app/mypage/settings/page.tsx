import { StubTabPanel } from "@/features/mypage/components/StubTabPanel";
import { SegmentHeader } from "@/features/mypage/components/SegmentHeader";

export default function SettingsPage() {
  return (
    <>
      <SegmentHeader
        title="설정"
        subtitle="계정 · 알림 · 개인정보."
      />
      <StubTabPanel
        emoji="⚙️"
        title="설정"
        subtitle="아직 준비 중. 계정·알림·개인정보 관리 곧 여기서."
        previewItems={[
          "알림 설정",
          "차단 사용자 관리",
          "본인 인증",
          "약관 · 개인정보처리방침",
        ]}
      />
    </>
  );
}
