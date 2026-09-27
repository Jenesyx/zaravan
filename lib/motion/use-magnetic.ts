"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";
import { DURATION, EASE } from "./tokens";

const RADIUS = 80; // Design.md §4.4.
const LERP = 0.18;

export function useMagnetic(ref: RefObject<HTMLElement | null>, active = true) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !active || !element) return;
    if (!window.matchMedia("(pointer: fine)").matches || navigator.maxTouchPoints > 0) return;

    const setX = gsap.quickSetter(element, "x", "px");
    const setY = gsap.quickSetter(element, "y", "px");
    let rect = element.getBoundingClientRect();
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    const measure = () => { rect = element.getBoundingClientRect(); };
    const tick = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      setX(currentX);
      setY(currentY);
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.1) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };
    const onMove = (event: PointerEvent) => {
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) > RADIUS) {
        if (targetX || targetY) onLeave();
        return;
      }
      currentX = Number(gsap.getProperty(element, "x"));
      currentY = Number(gsap.getProperty(element, "y"));
      gsap.killTweensOf(element);
      element.style.willChange = "transform";
      targetX = dx * LERP;
      targetY = dy * LERP;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      targetX = 0;
      targetY = 0;
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: DURATION.base,
        ease: EASE.spring,
        onComplete: () => {
          currentX = 0;
          currentY = 0;
          element.style.willChange = "";
          measure();
        },
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(element);
      gsap.set(element, { clearProps: "x,y" });
      element.style.willChange = "";
    };
  }, [active, enabled, ref]);
}
