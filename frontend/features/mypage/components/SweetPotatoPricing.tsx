"use client";

/**
 * 고구마 관리 — 오빠(user) 구매 화면.
 * 원본 v1.0 가격표 중 '판매 팩' 만 노출. 내부 마진/환전/시급/원가는 숨김.
 *
 * 스킬: [[creator-economy]] · [[brand-cider]]
 */

interface Pack {
  key: string;
  name: string;
  desc?: string;
  goguma: number;
  perUnit?: string;
  price: string;
  badge?: string; // "웰컴" · "인기" · "정가" · "5%↓" ...
  badgeTone?: "free" | "hot" | "flat" | "sale";
  free?: boolean;
}

const PACKS: Pack[] = [
  {
    key: "welcome",
    name: "맛보기 한 줌",
    desc: "전화 소개팅 1회 체험",
    goguma: 10,
    price: "무료",
    badge: "웰컴 · 1인 1회",
    badgeTone: "free",
    free: true,
  },
  {
    key: "bag",
    name: "한 봉지",
    goguma: 20,
    perUnit: "790원",
    price: "15,800원",
    badge: "정가",
    badgeTone: "flat",
  },
  {
    key: "box",
    name: "한 박스",
    goguma: 60,
    perUnit: "750원",
    price: "45,000원",
    badge: "인기 · 5%↓",
    badgeTone: "hot",
  },
  {
    key: "5kg",
    name: "5kg 박스",
    goguma: 120,
    perUnit: "700원",
    price: "84,000원",
    badge: "11%↓",
    badgeTone: "sale",
  },
  {
    key: "10kg",
    name: "10kg 도매",
    goguma: 300,
    perUnit: "660원",
    price: "198,000원",
    badge: "16%↓",
    badgeTone: "sale",
  },
];

export function SweetPotatoPricing() {
  return (
    <div className="sp-shop">
      <header className="sp-shop__head">
        <h2 className="sp-shop__h1">🍠 고구마 충전</h2>
        <p className="sp-shop__sub">
          많이 살수록 개당 가격이 떨어져. 첫 사용자는 맛보기 한 줌 무료.
        </p>
      </header>

      <ul className="sp-shop__list">
        {PACKS.map((p) => (
          <li key={p.key}>
            <button
              type="button"
              className={`sp-pack ${p.free ? "sp-pack--free" : ""} ${
                p.badgeTone === "hot" ? "sp-pack--hot" : ""
              }`}
              onClick={() => {
                // TODO(charm-training v2): 결제 흐름 배선
                alert(`${p.name} · 고구마 ${p.goguma}개 · ${p.price} 구매 (준비 중)`);
              }}
            >
              <div className="sp-pack__head">
                <span className="sp-pack__emoji" aria-hidden>🍠</span>
                <div className="sp-pack__ident">
                  <div className="sp-pack__name">{p.name}</div>
                  {p.desc && <div className="sp-pack__desc">{p.desc}</div>}
                </div>
                {p.badge && (
                  <span className={`sp-pack__badge sp-pack__badge--${p.badgeTone}`}>
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="sp-pack__stats">
                <div className="sp-pack__stat">
                  <span className="sp-pack__stat-lab">받는 고구마</span>
                  <span className="sp-pack__stat-val">🍠 {p.goguma}</span>
                </div>
                {p.perUnit && (
                  <div className="sp-pack__stat">
                    <span className="sp-pack__stat-lab">개당</span>
                    <span className="sp-pack__stat-val">{p.perUnit}</span>
                  </div>
                )}
                <div className="sp-pack__stat sp-pack__stat--price">
                  <span className="sp-pack__stat-lab">결제</span>
                  <span className="sp-pack__stat-val sp-pack__stat-val--price">
                    {p.price}
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="sp-shop__foot-note">
        결제는 웹에서만 진행돼. 앱 결제는 지원하지 않아.
      </div>
    </div>
  );
}
