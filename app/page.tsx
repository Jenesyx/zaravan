import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { ProofMarquee } from "@/components/sections/proof-marquee";
import { Products } from "@/components/sections/products";
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
        <Products />
        <Features />
        <Testimonials />
        <ClosingStatement />
      </main>
      <Footer />
    </>
  );
}
