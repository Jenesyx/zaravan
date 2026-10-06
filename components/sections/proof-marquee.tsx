"use client";

import { useRef } from "react";
import { useMarqueeMotion } from "@/lib/motion/use-marquee-motion";

// Business.md §7.1 proof strip, plus the duties promise from §4.
const facts = [
  "Single-origin Khorasan",
  "ISO 3632-2 Category I",
  "2026 harvest",
  "Worldwide in under a week",
  "Duties paid to the EU, UK, US and Canada",
];

function FactSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="proof-marquee__set" aria-hidden={hidden || undefined}>
      {facts.map((fact) => <li className="proof-marquee__fact" key={fact}>{fact}</li>)}
    </ul>
  );
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
