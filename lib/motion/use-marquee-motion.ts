"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

export function useMarqueeMotion(
  viewportRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!enabled || !viewport || !track) return;

    // Two identical groups occupy the track, so -50% loops without a seam.
    track.style.willChange = "transform";
    const loop = gsap.to(track, { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
    let direction = 1;
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const nextScroll = window.scrollY;
      if (Math.abs(nextScroll - lastScroll) < 2) return;
      direction = nextScroll >= lastScroll ? 1 : -1;
      lastScroll = nextScroll;
      gsap.to(loop, { timeScale: direction * (viewport.matches(":hover") ? 0.3 : 1), duration: 0.35, overwrite: true });
    };
    const onEnter = () => gsap.to(loop, { timeScale: direction * 0.3, duration: 0.35, overwrite: true });
    const onLeave = () => gsap.to(loop, { timeScale: direction, duration: 0.35, overwrite: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(loop);
      loop.kill();
      gsap.set(track, { clearProps: "transform" });
      track.style.willChange = "";
    };
  }, [enabled, viewportRef, trackRef]);
}
