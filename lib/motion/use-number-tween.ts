"use client";

import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "@/components/ui/motion-provider";
import { DURATION, EASE } from "./tokens";

const writeText = (node: ChildNode, text: string) => { node.nodeValue = text; };

/**
 * Counts the element's text from the previous value to `value` when it changes.
 * React renders the final text; this only rewrites the nodeValue of React's own text node
 * in between, so React keeps ownership of the node and the end state always matches.
 */
export function useNumberTween(ref: RefObject<HTMLElement | null>, value: number, format: (value: number) => string) {
  const enabled = useMotionEnabled();
  const previous = useRef(value);

  useLayoutEffect(() => {
    const node = ref.current?.firstChild;
    const from = previous.current;
    previous.current = value;
    if (!enabled || !node || node.nodeType !== Node.TEXT_NODE || from === value) return;

    const counter = { value: from };
    writeText(node, format(from));
    const tween = gsap.to(counter, {
      value,
      duration: DURATION.quick,
      ease: EASE.out,
      onUpdate: () => writeText(node, format(counter.value)),
      onComplete: () => writeText(node, format(value)),
    });
    return () => {
      tween.kill();
      writeText(node, format(value));
    };
  }, [enabled, format, ref, value]);
}
