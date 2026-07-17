/**
 * 각 대분류/서브 페이지의 최소 stub.
 * 실제 컨텐츠는 이후 세션에서 구현.
 */
interface PageStubProps {
  emoji: string;
  title: string;
  subtitle: string;
}

export function PageStub({ emoji, title, subtitle }: PageStubProps) {
  return (
    <main
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-16) var(--space-6)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: "var(--space-6)" }}>
        {emoji}
      </div>
      <h1
        style={{
          fontSize: "var(--text-4xl)",
          fontWeight: 900,
          letterSpacing: "var(--tracking-tight)",
          marginBottom: "var(--space-4)",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--text-secondary)",
          maxWidth: 520,
          margin: "0 auto",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        {subtitle}
      </p>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--text-muted)",
          marginTop: "var(--space-12)",
        }}
      >
        곧 만나자.
      </p>
    </main>
  );
}
