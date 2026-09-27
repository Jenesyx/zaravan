"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

/** Mount heavy timelines only when a section is within two viewport heights. */
export function useNearViewport(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${window.innerHeight * 2}px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, ref]);

  return near;
}
