"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/components/ui/motion-provider";
import { DURATION, EASE, STAGGER } from "./tokens";

/**
 * Fades [data-reveal] children up in reading order as they enter. Items already on screen
 * (or above it, after a mid-page reload) are left alone, so nothing waits on an animation.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, active = true) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const root = ref.current;
    if (!enabled || !active || !root) return;
    const items = gsap.utils
      .toArray<HTMLElement>("[data-reveal]", root)
      .filter((item) => item.getBoundingClientRect().top > window.innerHeight);
    if (!items.length) return;

    const context = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: 32 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER.cards,
          overwrite: true,
          clearProps: "transform,visibility,opacity",
        }),
      });
    }, root);

    return () => context.revert();
  }, [active, enabled, ref]);
}
