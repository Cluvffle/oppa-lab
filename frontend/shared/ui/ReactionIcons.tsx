/**
 * 커뮤니티 반응 아이콘 — 고구마(답답 · 공감) / 사이다(속시원 · 인정).
 * 실제 마스코트 PNG (누끼). 항상 원래 색상으로 표시.
 * filled prop 은 하위호환용 (사용 안 함).
 */

interface Props {
  size?: number;
  filled?: boolean;
}

/**
 * 고구마 마스코트 아이콘 — 실제 마스코트 PNG (누끼 처리).
 * 알파 채널이 있어서 배경 없이 뜸.
 */
export function SweetPotatoSymbol({ size = 16 }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/avatars/sweet-potato-icon.png"
      alt=""
      width={size}
      height={size}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}

/**
 * 사이다 마스코트 아이콘 — 실제 마스코트 PNG 를 원형 없이 그대로 사용.
 * 알파 채널이 있어서 배경 없이 뜸. filled=false 시 opacity 낮춤.
 */
export function CiderSymbol({ size = 16 }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/avatars/cider-mascot-icon.png"
      alt=""
      width={size}
      height={size}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}
