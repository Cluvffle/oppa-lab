import Link from "next/link";
import { Badge } from "@/shared/ui/Badge";
import { LiveIcon } from "@/shared/ui/SectionIcons";
import { creatorsMock, formatRelationship } from "@/shared/lib/mock";

export function OnlineCreatorsSection() {
  const onlines = creatorsMock.filter((c) => c.isOnline);
  const track = [...onlines, ...onlines]; // 무한 마퀴용

  return (
    <section className="section section--no-top">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <LiveIcon size={28} />
              지금 온라인
            </h2>
            <p className="section-subtitle">
              지금 이야기 나눌 수 있는 친구들
            </p>
          </div>
          <Link href="/dating" className="section-link">
            전체 보기 →
          </Link>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {track.map((c, i) => (
            <article key={`${c.id}-${i}`} className="creator-mini">
              <div className="creator-mini__head">
                <div className="creator-mini__nickname">{c.nickname}</div>
                <Badge variant="online">ON</Badge>
              </div>
              <div className="creator-mini__meta">
                <span>{c.age}</span>
                <span className="creator-mini__meta-dot">·</span>
                <span>{c.mbti}</span>
                <span className="creator-mini__meta-dot">·</span>
                <span>{formatRelationship(c.relationship)}</span>
              </div>
              {/* 실적 stats는 "인기 투표" 프레임 방지 위해 카드에서 숨김.
                  데이터는 mock 유지 (상세 페이지 등에서 재사용 가능). */}
              <p className="creator-mini__bio">&ldquo;{c.bio}&rdquo;</p>
              <div className="creator-mini__tags">
                {c.personalityTags.map((t) => (
                  <span key={t} className="creator-mini__tag">
                    #{t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
