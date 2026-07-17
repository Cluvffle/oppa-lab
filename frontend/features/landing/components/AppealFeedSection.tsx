import Link from "next/link";
import { appealFeedMock, appealCategoryLabel } from "@/shared/lib/mock";
import { FeedIcon } from "@/shared/ui/SectionIcons";

export function AppealFeedSection() {
  const track = [...appealFeedMock, ...appealFeedMock];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <FeedIcon size={28} />
              인기 어필 피드
            </h2>
            <p className="section-subtitle">
              성장 서사가 담긴 오늘의 어필들
            </p>
          </div>
          <Link href="/feed" className="section-link">
            전체 피드 →
          </Link>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-track marquee-track--reverse">
          {track.map((f, i) => (
            <article key={`${f.id}-${i}`} className="appeal-card">
              <div className="appeal-card__head">
                <span className="appeal-card__category">
                  {appealCategoryLabel[f.category]}
                </span>
                {f.isGrowthPair && (
                  <span className="appeal-card__growth">성장 🌱</span>
                )}
              </div>
              <p className="appeal-card__title">{f.title}</p>
              <div className="appeal-card__stats">
                <span>
                  <strong>❤️ {f.likes}</strong>
                </span>
                <span>
                  <strong>💬 {f.feedbacks}</strong>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
