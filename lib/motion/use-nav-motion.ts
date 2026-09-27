"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

export function useNavMotion(ref: RefObject<HTMLElement | null>, menuOpen: boolean) {
  const enabled = useMotionEnabled();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let previous = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > window.innerHeight * 0.8);
      if (enabled && !menuOpen && Math.abs(current - previous) > 4) {
        const nextHidden = current > previous && current > 120;
        if (nextHidden !== hidden) {
          hidden = nextHidden;
          gsap.to(nav, {
            yPercent: hidden ? -100 : 0,
            opacity: hidden ? 0 : 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
            onStart: () => { nav.style.willChange = "transform, opacity"; },
            onComplete: () => { nav.style.willChange = ""; },
          });
        }
      }
      previous = current;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(nav);
      gsap.set(nav, { clearProps: "transform,opacity" });
      nav.style.willChange = "";
    };
  }, [enabled, menuOpen, ref]);

  return scrolled;
}
