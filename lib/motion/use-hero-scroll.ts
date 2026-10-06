"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/components/ui/motion-provider";

type HeroRefs = {
  section: RefObject<HTMLElement | null>;
  /** Full-bleed layer clipped to the frame by CSS (--frame-t/r/b/l on the section). */
  media: RefObject<HTMLElement | null>;
  /** Inner layer offset by --shift-x/y and scaled by --frame-scale so the subject sits in the frame. */
  shift: RefObject<HTMLElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  content: RefObject<HTMLElement | null>;
  scrim: RefObject<HTMLElement | null>;
  caption: RefObject<HTMLElement | null>;
};

type Sequence = { frameCount: number; frame: (index: number) => string };

const PIN_LENGTH = "+=300%";
const LOAD_CONCURRENCY = 6;

/**
 * Pins the hero while the frame opens to full bleed, then hands the scrollbar to the film:
 * scrolling down steps the frame sequence forward, scrolling up steps it back, and the page
 * continues once the last frame is reached. Frames are drawn to a canvas with cover fit.
 */
export function useHeroScroll(refs: HeroRefs, sequence: Sequence) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const section = refs.section.current;
    const media = refs.media.current;
    const shift = refs.shift.current;
    const canvas = refs.canvas.current;
    const content = refs.content.current;
    const scrim = refs.scrim.current;
    const caption = refs.caption.current;
    const painter = canvas?.getContext("2d");
    if (!enabled || !section || !media || !shift || !canvas || !painter || !content || !scrim || !caption) return;

    // Phones get every second frame: half the bytes, same motion at that size.
    const step = window.matchMedia("(max-width: 767px)").matches ? 2 : 1;
    const indices = Array.from({ length: Math.ceil(sequence.frameCount / step) }, (_, i) => Math.min(i * step, sequence.frameCount - 1));
    const frames: (HTMLImageElement | null)[] = indices.map(() => null);
    let target = 0;
    let drawn = -1;
    let disposed = false;

    // Draw the requested frame, or the nearest earlier one that has arrived.
    const draw = (position: number) => {
      let index = position;
      while (index > 0 && !frames[index]) index -= 1;
      const image = frames[index];
      if (!image || index === drawn) return;
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      painter.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      drawn = index;
    };

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      drawn = -1;
      draw(target);
    };

    // Frame one first, then the rest in order, a few at a time.
    let next = 1;
    const load = (position: number) => new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.src = sequence.frame(indices[position]);
      image.decode().catch(() => {}).finally(() => {
        if (disposed) return resolve();
        if (image.naturalWidth) frames[position] = image;
        if (position <= target && position > drawn) draw(target);
        resolve();
      });
    });
    const worker = async () => {
      while (!disposed && next < indices.length) await load(next++);
    };
    void load(0).then(() => {
      for (let i = 0; i < LOAD_CONCURRENCY; i += 1) void worker();
    });

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    const cssVar = (name: string) => getComputedStyle(section).getPropertyValue(name).trim();
    const frameInset = () => `inset(${cssVar("--frame-t")} ${cssVar("--frame-r")} ${cssVar("--frame-b")} ${cssVar("--frame-l")})`;
    const shiftX = () => parseFloat(cssVar("--shift-x")) || 0;
    const shiftY = () => parseFloat(cssVar("--shift-y")) || 0;
    const frameScale = () => parseFloat(cssVar("--frame-scale")) || 1;
    const playhead = { position: 0 };

    const context = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: PIN_LENGTH,
          pin: true,
          scrub: 0.6,
          refreshPriority: 1, // Measured first: everything below sits after its pin spacer.
          invalidateOnRefresh: true,
          onToggle: (self) => {
            media.style.willChange = self.isActive ? "clip-path" : "";
            shift.style.willChange = self.isActive ? "transform" : "";
          },
        },
      })
        .to(content, { autoAlpha: 0, y: -40, duration: 0.14 }, 0)
        .fromTo(media, { clipPath: frameInset }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.26 }, 0)
        .fromTo(shift, { x: 0, y: 0, xPercent: shiftX, yPercent: shiftY, scale: frameScale }, { xPercent: 0, yPercent: 0, scale: 1, duration: 0.26 }, 0)
        .to(scrim, { opacity: 1, duration: 0.26 }, 0.04)
        .to(playhead, {
          position: indices.length - 1,
          duration: 0.84,
          onUpdate: () => {
            target = Math.round(playhead.position);
            draw(target);
          },
        }, 0.08)
        .fromTo(caption, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.84);
    }, section);
    ScrollTrigger.refresh();

    return () => {
      disposed = true;
      observer.disconnect();
      context.revert();
      painter.clearRect(0, 0, canvas.width, canvas.height);
      media.style.willChange = "";
      shift.style.willChange = "";
    };
  }, [enabled, sequence, refs.section, refs.media, refs.shift, refs.canvas, refs.content, refs.scrim, refs.caption]);
}
