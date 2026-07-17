import Link from "next/link";
import { hotPostsMock } from "@/shared/lib/mock";
import { CommunityIcon } from "@/shared/ui/SectionIcons";

export function CommunitySection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <CommunityIcon size={28} />
              실시간 라운지
            </h2>
            <p className="section-subtitle">
              지금 활발히 대화 중인 게시글들
            </p>
          </div>
          <Link href="/community" className="section-link">
            라운지 전체 →
          </Link>
        </div>

        <div className="post-list">
          {hotPostsMock.map((p) => (
            <Link
              key={p.id}
              href={`/community/post/${p.id}`}
              className="post-item"
            >
              <span className="post-item__board">#{p.boardLabel}</span>
              <span className="post-item__title">{p.title}</span>
              <span className="post-item__meta">{p.meta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
