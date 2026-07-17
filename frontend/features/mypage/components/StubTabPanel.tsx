interface StubTabPanelProps {
  emoji: string;
  title: string;
  subtitle: string;
  previewItems: string[];
}

/** 아직 구현되지 않은 마이페이지 탭 안의 placeholder. */
export function StubTabPanel({
  emoji,
  title,
  subtitle,
  previewItems,
}: StubTabPanelProps) {
  return (
    <section className="stub-panel">
      <span className="stub-panel__emoji" aria-hidden>
        {emoji}
      </span>
      <h2 className="stub-panel__title">{title}</h2>
      <p className="stub-panel__sub">{subtitle}</p>

      <div className="stub-panel__preview">
        <span className="stub-panel__preview-label">여기서 볼 수 있을 거야</span>
        <ul className="stub-panel__preview-list">
          {previewItems.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </div>

      <span className="stub-panel__coming">곧 준비될 거야</span>
    </section>
  );
}
