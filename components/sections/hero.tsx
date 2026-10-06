"use client";

import { getImageProps } from "next/image";
import { useRef } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { heroSequence } from "@/lib/data/hero";
import { useHeroScroll } from "@/lib/motion/use-hero-scroll";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { DURATION } from "@/lib/motion/tokens";

// Frame one is the poster the canvas takes over from. Readers who prefer reduced motion
// never scrub, so they get the closing frame, the finished shot of the jar, instead.
const posterBase = { alt: heroSequence.alt, width: heroSequence.width, height: heroSequence.height, sizes: "100vw" };
const { props: { srcSet: firstFrame, ...poster } } = getImageProps({
  ...posterBase,
  src: heroSequence.frame(0),
  loading: "eager",
  fetchPriority: "high",
});
const { props: { srcSet: lastFrame } } = getImageProps({ ...posterBase, src: heroSequence.frame(heroSequence.frameCount - 1) });

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const shift = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useLineRise(heading, { delay: 0.15, duration: DURATION.cinematic });
  useHeroScroll({ section, media, shift, canvas, content, scrim, caption }, heroSequence);

  return (
    <section id="top" ref={section} className="hero" aria-labelledby="hero-title">
      {/* No data-anim here: the reduced-motion reset would clear the CSS frame clip. */}
      <div ref={media} className="hero__media">
        <div ref={shift} className="hero__shift">
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={lastFrame} />
            <img {...poster} srcSet={firstFrame} className="hero__poster" alt={heroSequence.alt} />
          </picture>
          <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />
        </div>
        <div ref={scrim} className="hero__scrim" aria-hidden="true" />
      </div>

      <div ref={content} className="hero__content shell" data-anim>
        <h1 ref={heading} id="hero-title" className="hero__title" data-anim>Red gold from <em>Khorasan.</em></h1>
        <p className="hero__lead">Single-origin saffron, hand-picked by the third generation of one family and laboratory-verified before it leaves the farm.</p>
        <ActionLink href="#products" variant="primary">Shop the harvest</ActionLink>
      </div>

      <p ref={caption} className="hero__caption" aria-hidden="true">Picked by hand before the flower opens. Separated the same day.</p>
    </section>
  );
}
