"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

const OFFSETS = [64, 32, 80]; // Centre column moves slowest, per Design.md §6.07.

export function useTestimonialDrift(ref: RefObject<HTMLElement | null>) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const section = ref.current;
    if (!enabled || !section || window.matchMedia("(max-width: 767px)").matches) return;
    const columns = section.querySelectorAll<HTMLElement>("[data-drift-column]");
    const listeners: Array<() => void> = [];

    const context = gsap.context(() => {
      columns.forEach((column, index) => {
        const tween = gsap.fromTo(column, { y: OFFSETS[index] }, {
          y: -OFFSETS[index],
          ease: "none",
          scrollTrigger: {
            trigger: section, start: "top bottom", end: "bottom top", scrub: true,
            onEnter: () => { column.style.willChange = "transform"; },
            onEnterBack: () => { column.style.willChange = "transform"; },
            onLeave: () => { column.style.willChange = ""; },
            onLeaveBack: () => { column.style.willChange = ""; },
          },
        });
        const pause = () => tween.scrollTrigger?.disable(false);
        const resume = () => tween.scrollTrigger?.enable();
        column.addEventListener("pointerenter", pause);
        column.addEventListener("pointerleave", resume);
        listeners.push(() => {
          column.removeEventListener("pointerenter", pause);
          column.removeEventListener("pointerleave", resume);
          column.style.willChange = "";
        });
      });
    }, section);

    return () => {
      listeners.forEach((remove) => remove());
      context.revert();
    };
  }, [enabled, ref]);
}
