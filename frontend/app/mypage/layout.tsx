import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <main className="mypage">
        <div className="mypage__inner">{children}</div>
      </main>
      <Footer />
    </>
  );
}
