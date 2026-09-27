"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

export function useCarouselMotion(
  viewportRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  index: number,
  near: boolean,
) {
  const enabled = useMotionEnabled();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const enhanced = enabled && near && desktop;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || enhanced) return;
    gsap.killTweensOf(track);
    gsap.set(track, { clearProps: "transform" });
    track.querySelectorAll<HTMLElement>("[data-product-slide]").forEach((slide) => {
      gsap.killTweensOf(slide);
      gsap.set(slide, { clearProps: "transform,opacity" });
    });
  }, [enhanced, viewportRef, trackRef]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const slides = [...track.querySelectorAll<HTMLElement>("[data-product-slide]")];
    const first = slides[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = first.offsetWidth + gap;

    if (!enhanced) {
      if (desktop) viewport.scrollTo({ left: index * step, behavior: "instant" });
      return;
    }

    viewport.scrollLeft = 0;
    const animated = [track, ...slides];
    const clearWillChange = () => animated.forEach((node) => { node.style.willChange = ""; });
    const timeline = gsap.timeline({
      onStart: () => animated.forEach((node) => { node.style.willChange = "transform, opacity"; }),
      onComplete: clearWillChange,
    });
    timeline.to(track, { x: -index * step, duration: 0.7, ease: "power3.inOut" }, 0);
    slides.forEach((slide, slideIndex) => {
      timeline.to(slide, {
        scale: slideIndex === index ? 1 : 0.92,
        opacity: slideIndex === index ? 1 : 0.4,
        duration: 0.7,
        ease: "power3.inOut",
      }, 0);
    });
    return () => { timeline.kill(); clearWillChange(); };
  }, [desktop, enhanced, index, viewportRef, trackRef]);

  useEffect(() => {
    const track = trackRef.current;
    if (!enhanced || !track) return;
    const onResize = () => {
      const slides = track.querySelectorAll<HTMLElement>("[data-product-slide]");
      if (!slides[0]) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      gsap.set(track, { x: -index * (slides[0].offsetWidth + gap) });
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [enhanced, index, trackRef]);

  return enhanced;
}
