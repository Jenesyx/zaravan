"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useMotionEnabled } from "@/components/ui/motion-provider";
import { EASE, STAGGER } from "./tokens";

export function useLineRise(
  ref: RefObject<HTMLElement | null>,
  { active = true, delay = 0, duration = 0.9 }: { active?: boolean; delay?: number; duration?: number } = {},
) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !active || !element) return;

    let split: SplitType | null = null;
    let tween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let revealed = false;
    let width = element.clientWidth;

    const clear = () => {
      trigger?.kill();
      trigger = null;
      tween?.kill();
      tween = null;
      split?.revert();
      split = null;
      element.style.willChange = "";
    };

    const build = () => {
      if (disposed || revealed) return;
      clear();
      split = new SplitType(element, { types: "lines", tagName: "span" });
      const lines = split.lines ?? [];
      if (!lines.length) return;

      for (const line of lines) {
        const mask = document.createElement("span");
        mask.style.display = "block";
        mask.style.overflow = "hidden";
        line.replaceWith(mask);
        mask.appendChild(line);
      }

      tween = gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration,
          delay,
          stagger: STAGGER.lines,
          ease: EASE.out,
          paused: true,
          onStart: () => {
            lines.forEach((line) => { line.style.willChange = "transform"; });
          },
          onComplete: () => {
            revealed = true;
            clear(); // Restore ordinary, responsive text after the reveal.
          },
        },
      );
      trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        once: true,
        onEnter: () => tween?.play(),
      });
    };

    const observer = new ResizeObserver(() => {
      const nextWidth = element.clientWidth;
      if (nextWidth === width) return;
      width = nextWidth;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });
    observer.observe(element);

    // Line breaks are measured only after the self-hosted fonts settle.
    void document.fonts.ready.then(() => { if (!disposed) build(); });

    return () => {
      disposed = true;
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      clear();
    };
  }, [active, delay, duration, enabled, ref]);
}
