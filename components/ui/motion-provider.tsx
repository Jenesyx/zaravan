"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
// Mobile address bars resize the viewport while scrolling; don't re-measure the hero pin for that.
ScrollTrigger.config({ ignoreMobileResize: true });

const MotionContext = createContext(false);

export function useMotionEnabled() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let lenis: Lenis | null = null;
    let removeLenisScroll: (() => void) | null = null;
    let ticker: ((time: number) => void) | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const stopLenis = () => {
      if (ticker) gsap.ticker.remove(ticker);
      ticker = null;
      removeLenisScroll?.();
      removeLenisScroll = null;
      lenis?.destroy();
      lenis = null;
    };

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setEnabled(false);
      gsap.set("[data-anim]", {
        clearProps: "all",
        opacity: 1,
        y: 0,
        clipPath: "none",
      });
      // Motion hooks tear down their own timelines when `enabled` flips; triggers that only
      // track state (the nav background) keep running.
      stopLenis(); // Native scroll under reduced motion.
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      setEnabled(true);

      // Smooth wheel scrolling is intentionally absent on touch devices.
      if (window.matchMedia("(pointer: fine)").matches && navigator.maxTouchPoints === 0) {
        lenis = new Lenis({ autoRaf: false });
        removeLenisScroll = lenis.on("scroll", ScrollTrigger.update);
        ticker = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      return () => stopLenis();
    });

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      mm.revert();
      stopLenis();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <MotionContext.Provider value={enabled}>{children}</MotionContext.Provider>;
}
