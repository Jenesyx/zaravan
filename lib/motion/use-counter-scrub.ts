"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

type CounterOptions = {
  from: number;
  to: number;
  format?: (value: number) => string;
  active?: boolean;
};

/** Keep the final formatted value in SSR markup; this only enhances it on scroll. */
export function useCounterScrub(
  ref: RefObject<HTMLElement | null>,
  { from, to, format = String, active = true }: CounterOptions,
) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !active || !element) return;
    const initialText = element.textContent;
    const counter = { value: from };
    element.textContent = format(from);

    const context = gsap.context(() => {
      gsap.to(counter, {
        value: to,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 20%",
          scrub: true,
        },
        onUpdate: () => { element.textContent = format(counter.value); },
      });
    }, element);

    return () => {
      context.revert(); // Kills the tween and its ScrollTrigger.
      element.textContent = initialText;
    };
  }, [active, enabled, ref, from, to, format]);
}
