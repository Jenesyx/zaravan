"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

export function useFooterMotion(
  footerRef: RefObject<HTMLElement | null>,
  wordmarkRef: RefObject<HTMLElement | null>,
) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const footer = footerRef.current;
    const wordmark = wordmarkRef.current;
    if (!enabled || !footer || !wordmark) return;
    const context = gsap.context(() => {
      gsap.fromTo(wordmark, { y: 32 }, {
        y: -32,
        ease: "none",
        scrollTrigger: {
          trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true,
          onEnter: () => { wordmark.style.willChange = "transform"; },
          onEnterBack: () => { wordmark.style.willChange = "transform"; },
          onLeave: () => { wordmark.style.willChange = ""; },
          onLeaveBack: () => { wordmark.style.willChange = ""; },
        },
      });
    }, footer);
    return () => { context.revert(); wordmark.style.willChange = ""; };
  }, [enabled, footerRef, wordmarkRef]);
}
