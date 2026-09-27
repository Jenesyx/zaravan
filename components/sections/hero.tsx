"use client";

import Image from "next/image";
import { useRef } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { SectionLabel } from "@/components/ui/section-label";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { DURATION } from "@/lib/motion/tokens";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  useLineRise(headingRef, { delay: 0.2, duration: DURATION.cinematic });
  useLineRise(leadRef, { delay: 0.5, duration: DURATION.base });
  useHeroMotion(sectionRef, contentRef, mediaRef, glowRef);

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div ref={mediaRef} className="hero__media" aria-hidden="true">
        {/* Placeholder for Design.md §11: hero video / priority macro poster of saffron threads on black. */}
        <Image src="/images/hero-threads.svg" alt="" width={1600} height={1100} preload fetchPriority="high" sizes="100vw" className="hero__image" />
      </div>
      <div ref={glowRef} className="hero__glow" aria-hidden="true" />
      <div ref={contentRef} className="hero__content shell" data-anim>
        <SectionLabel>THE KEEPER OF GOLD</SectionLabel>
        <h1 ref={headingRef} id="hero-title" className="hero__title" data-anim>Red gold from <em>Khorasan.</em></h1>
        <p ref={leadRef} className="hero__lead" data-anim>Single-origin saffron, hand-picked by the third generation of one family and verified by laboratory before it leaves the farm.</p>
        <ActionLink href="#products" variant="primary">Shop the harvest</ActionLink>
      </div>
      <div className="hero__bottom shell" aria-hidden="true">
        <span className="eyebrow">EST. 1961<br />KHORASAN, IRAN</span>
        <span className="hero__scroll"><span className="eyebrow">SCROLL TO DISCOVER</span><span className="hero__scroll-rule" /></span>
      </div>
    </section>
  );
}
