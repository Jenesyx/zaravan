"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/components/ui/motion-provider";

/** Endless loop that follows the reader's scroll direction, slows under the pointer, and rests off-screen. */
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
    const loop = gsap.to(track, { xPercent: -50, duration: 60, ease: "none", repeat: -1, paused: true });
    let direction = 1;
    let hovering = false;
    const steer = () => gsap.to(loop, { timeScale: direction * (hovering ? 0.3 : 1), duration: 0.35, overwrite: true });

    const trigger = ScrollTrigger.create({
      trigger: viewport,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        track.style.willChange = self.isActive ? "transform" : "";
        if (self.isActive) loop.resume();
        else loop.pause();
      },
      onUpdate: (self) => {
        if (self.direction === direction) return;
        direction = self.direction;
        steer();
      },
    });
    const onEnter = () => { hovering = true; steer(); };
    const onLeave = () => { hovering = false; steer(); };
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);

    return () => {
      trigger.kill();
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(loop);
      loop.kill();
      gsap.set(track, { clearProps: "transform" });
      track.style.willChange = "";
    };
  }, [enabled, viewportRef, trackRef]);
}
