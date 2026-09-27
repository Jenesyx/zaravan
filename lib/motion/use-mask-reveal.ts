"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";
import { DURATION, EASE } from "./tokens";

/**
 * The target must contain a decorative [data-mask-cover] overlay (aria-hidden).
 * CSS keeps that overlay collapsed, so the image remains visible without JS.
 */
export function useMaskReveal(ref: RefObject<HTMLElement | null>, active = true) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !active || !element) return;
    const cover = element.querySelector<HTMLElement>("[data-mask-cover]");
    if (!cover) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        cover,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: DURATION.slow,
          ease: EASE.expo,
          scrollTrigger: { trigger: element, start: "top 85%", once: true },
          onStart: () => { cover.style.willChange = "transform"; },
          onComplete: () => { cover.style.willChange = ""; },
        },
      );
    }, element);

    return () => {
      context.revert(); // Reverts and kills the tween and its ScrollTrigger.
      cover.style.willChange = "";
    };
  }, [active, enabled, ref]);
}
