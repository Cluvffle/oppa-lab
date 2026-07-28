import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">
          고구마 같던 대화가, <br></br><span className="hero-accent">사이다가 될 때까지</span>.
        </h1>
        <p className="hero-sub">
          이성과의 대화 근육을 키우고<br></br>실전 연애까지 함께 가는 놀이터
        </p>
        <div className="hero-cta">
          <Link href="/emergency">
            <Button variant="primary" size="lg">
              고민 물어보기
            </Button>
          </Link>
          <Link href="/dating">
            <Button size="lg">친구 둘러보기</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
