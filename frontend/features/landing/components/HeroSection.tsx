import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">
          어색함이 자신감이 <span className="hero-accent">될 때까지</span>.
        </h1>
        <p className="hero-sub">
          여자의 눈으로 봐줄게.
          <br />
          챠밍은 이성과의 대화 근육을 키우고, 실전 연애까지 함께 가는 놀이터야!
        </p>
        <div className="hero-cta">
          <Link href="/emergency">
            <Button variant="primary" size="lg">
              지금 할까말까 물어보기
            </Button>
          </Link>
          <Link href="/panels">
            <Button size="lg">친구 둘러보기</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
