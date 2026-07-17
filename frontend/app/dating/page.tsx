import { Suspense } from "react";
import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";
import { CreatorGrid } from "@/features/dating/components/CreatorGrid";

export default function DatingPage() {
  return (
    <>
      <Suspense fallback={<div className="header" />}>
        <Header />
      </Suspense>
      <CreatorGrid />
      <Footer />
    </>
  );
}
