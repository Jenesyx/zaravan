"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/components/ui/motion-provider";

/** Solid background once the page has moved; hides on scroll down, returns on scroll up. */
export function useNavMotion(ref: RefObject<HTMLElement | null>, menuOpen: boolean) {
  const enabled = useMotionEnabled();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let hidden = false;

    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      gsap.to(nav, {
        yPercent: hidden ? -100 : 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
        onStart: () => { nav.style.willChange = "transform"; },
        onComplete: () => { nav.style.willChange = ""; },
      });
    };

    setScrolled(window.scrollY > 24);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const position = self.scroll();
        setScrolled(position > 24);
        if (enabled && !menuOpen) setHidden(self.direction === 1 && position > 160);
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(nav);
      gsap.set(nav, { clearProps: "transform" });
      nav.style.willChange = "";
    };
  }, [enabled, menuOpen, ref]);

  return scrolled;
}
