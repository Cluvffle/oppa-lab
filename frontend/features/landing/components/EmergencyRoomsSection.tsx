import Link from "next/link";
import { emergencyRoomsMock } from "@/shared/lib/mock";

export function EmergencyRoomsSection() {
  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">🤔 할까말까</h2>
            <p className="section-subtitle">
              완전 무료 · 무제한 · 여자의 눈으로 봐줄게
            </p>
          </div>
        </div>

        <div className="emergency-grid">
          {emergencyRoomsMock.map((r) => (
            <Link
              key={r.code}
              href={`/emergency/${r.code}`}
              className="emergency-card"
            >
              <div className="emergency-card__icon" aria-hidden>
                {r.icon}
              </div>
              <div className="emergency-card__name">{r.name}</div>
              <div className="emergency-card__sub">{r.subtitle}</div>
              <div className="emergency-card__count">
                지금 {r.liveCount}건 답변 대기
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
