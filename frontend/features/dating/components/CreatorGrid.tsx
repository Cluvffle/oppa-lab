"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/ui/Badge";
import { Avatar } from "@/shared/ui/Avatar";
import { MultiSelectDropdown } from "@/shared/ui/MultiSelectDropdown";
import {
  creatorsMock,
  isRookieCreator,
  formatRelationship,
  personalityLabel,
  positionLabel,
  type CreatorMock,
  type PersonalityTrait,
  type Position,
} from "@/shared/lib/mock";

function CreatorCard({ c }: { c: CreatorMock }) {
  const isRookie = isRookieCreator(c);
  return (
    <Link href={`/dating/${c.id}`} className="creator-card-tile">
      <div className="creator-card-tile__head">
        <Avatar src={c.avatar} size="lg" ring={c.isOnline} alt={c.nickname} />
        <div className="creator-card-tile__head-info">
          <div className="creator-card-tile__nickname-row">
            <span className="creator-card-tile__nickname">
              {c.nickname}
              {isRookie && <span className="new-badge">NEW</span>}
            </span>
            {c.isOnline && <Badge variant="online">ON</Badge>}
          </div>
          <div className="creator-card-tile__meta">
            <span>{c.age}</span>
            <span className="creator-card-tile__dot">·</span>
            <span>{c.mbti}</span>
            <span className="creator-card-tile__dot">·</span>
            <span className="creator-card-tile__relationship">
              {formatRelationship(c.relationship)}
            </span>
          </div>
        </div>
      </div>

      {/* 실적 stats는 "인기 투표" 프레임 방지 위해 카드에서 숨김.
          데이터는 mock에 유지 (상세 페이지에서 재사용 가능). */}

      <p className="creator-card-tile__bio">"{c.bio}"</p>
      <div className="creator-card-tile__tags">
        {c.personalityTags.map((t) => (
          <span key={t} className="creator-card-tile__tag">
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}

const traitOptions = (
  Object.entries(personalityLabel) as [PersonalityTrait, string][]
).map(([value, label]) => ({ value, label }));

const positionOptions = (
  Object.entries(positionLabel) as [Position, string][]
).map(([value, label]) => ({ value, label }));

export function CreatorGrid() {
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [traits, setTraits] = useState<PersonalityTrait[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const filtered = useMemo(() => {
    return creatorsMock
      .filter((c) => (onlineOnly ? c.isOnline : true))
      .filter((c) =>
        traits.length === 0 ? true : traits.includes(c.relationship.trait)
      )
      .filter((c) =>
        positions.length === 0
          ? true
          : positions.includes(c.relationship.position)
      )
      .sort((a, b) => {
        if (a.isOnline === b.isOnline) return 0;
        return a.isOnline ? -1 : 1;
      });
  }, [onlineOnly, traits, positions]);

  return (
    <div className="creator-list">
      <div className="creator-list__header">
        <div className="creator-list__intro">
          <h1 className="creator-list__title">진짜인듯 진짜아닌 소개팅, 상대는?</h1>
          <p className="creator-list__sub">
            딱 10분줄게, 오빠 매력을 어필해봐. 애프터 딸 수 있겠어?
          </p>
        </div>

        <div className="creator-list__filters">
          <button
            type="button"
            onClick={() => setOnlineOnly((v) => !v)}
            className={`online-toggle ${onlineOnly ? "online-toggle--on" : ""}`}
          >
            <span className="online-toggle__dot" />
            지금 온라인만
          </button>

          <MultiSelectDropdown<PersonalityTrait>
            label="성격"
            options={traitOptions}
            selected={traits}
            onChange={setTraits}
          />

          <MultiSelectDropdown<Position>
            label="캐릭터"
            options={positionOptions}
            selected={positions}
            onChange={setPositions}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="creator-list__empty">
          조건에 맞는 친구가 없어. 필터를 다시 확인해봐.
        </div>
      ) : (
        <div className="creator-tile-grid">
          {filtered.map((c) => (
            <CreatorCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
