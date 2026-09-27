"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";

export function useHeroMotion(
  sectionRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  mediaRef: RefObject<HTMLElement | null>,
  glowRef: RefObject<HTMLElement | null>,
) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const media = mediaRef.current;
    const glow = glowRef.current;
    if (!enabled || !section || !content || !media || !glow) return;

    const context = gsap.context(() => {
      gsap.to(content, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section, start: "top top", end: "bottom top", scrub: true,
          onEnter: () => { content.style.willChange = "transform, opacity"; },
          onEnterBack: () => { content.style.willChange = "transform, opacity"; },
          onLeave: () => { content.style.willChange = ""; },
          onLeaveBack: () => { content.style.willChange = ""; },
        },
      });
      gsap.to(media, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: section, start: "top top", end: "bottom top", scrub: true,
          onEnter: () => { media.style.willChange = "transform"; },
          onEnterBack: () => { media.style.willChange = "transform"; },
          onLeave: () => { media.style.willChange = ""; },
          onLeaveBack: () => { media.style.willChange = ""; },
        },
      });
      gsap.fromTo(glow, { opacity: 0.12 }, {
        opacity: 0.22,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, section);

    return () => {
      context.revert();
      content.style.willChange = "";
      media.style.willChange = "";
    };
  }, [enabled, sectionRef, contentRef, mediaRef, glowRef]);
}
