import { realCommentsMock } from "@/shared/lib/mock";
import { CommentIcon } from "@/shared/ui/SectionIcons";

export function RealCommentsSection() {
  const track = [...realCommentsMock, ...realCommentsMock];

  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <CommentIcon size={28} />
              오늘의 팩폭
            </h2>
            <p className="section-subtitle">
              여자의 시선으로 남긴 현실 조언
            </p>
          </div>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-track marquee-track--slow">
          {track.map((c, i) => (
            <article key={`${c.id}-${i}`} className="comment-card">
              <p className="comment-card__quote">{c.text}</p>
              <div className="comment-card__author">— {c.authorName}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
