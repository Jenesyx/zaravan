import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { ProofMarquee } from "@/components/sections/proof-marquee";
import { Signature } from "@/components/sections/signature";
import { Collection } from "@/components/sections/collection";
import { Features } from "@/components/sections/features";
import { Testimonials } from "@/components/sections/testimonials";
import { ClosingStatement } from "@/components/sections/closing-statement";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <ProofMarquee />
        <Signature />
        <Collection />
        <Features />
        <Testimonials />
        <ClosingStatement />
      </main>
      <Footer />
    </>
  );
}
