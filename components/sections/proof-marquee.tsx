"use client";

import { useRef } from "react";
import { useMarqueeMotion } from "@/lib/motion/use-marquee-motion";

const facts = [
  "SINGLE-ORIGIN KHORASAN",
  "ISO 3632-2 CATEGORY I",
  "2026 HARVEST",
  "CROCIN 287",
  "WORLDWIDE IN UNDER 7 DAYS",
  "DUTIES PAID",
];

function FactSet({ hidden = false }: { hidden?: boolean }) {
  return <span className="proof-marquee__set" aria-hidden={hidden}>{facts.map((fact) => <span className="proof-marquee__fact" key={fact}>{fact}<span className="proof-marquee__dot" aria-hidden="true">·</span></span>)}</span>;
}

export function ProofMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useMarqueeMotion(viewportRef, trackRef);
  return (
    <section className="proof-marquee" aria-label="Harvest facts">
      <div ref={viewportRef} className="proof-marquee__viewport">
        <div ref={trackRef} className="proof-marquee__track"><FactSet /><FactSet hidden /></div>
      </div>
    </section>
  );
}
