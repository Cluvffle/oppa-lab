import { Header } from "@/shared/layout/Header";
import { Footer } from "@/shared/layout/Footer";
import { RealCommentsBoard } from "@/features/dating/components/RealCommentsBoard";

export default function DatingCommentsPage() {
  return (
    <>
      <Header />
      <RealCommentsBoard />
      <Footer />
    </>
  );
}
