interface Props {
  title: string;
  subtitle: string;
  /** 우측 액션 슬롯 (필터, 정렬 등) */
  actions?: React.ReactNode;
}

/** 마이페이지 하위 세그먼트 상단 헤더 (h1 + sub + 우측 액션 슬롯). */
export function SegmentHeader({ title, subtitle, actions }: Props) {
  return (
    <header className="mypage-seg__head">
      <div className="mypage-seg__intro">
        <h1 className="mypage-seg__title">{title}</h1>
        <p className="mypage-seg__sub">{subtitle}</p>
      </div>
      {actions && <div className="mypage-seg__actions">{actions}</div>}
    </header>
  );
}
