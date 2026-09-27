"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useNearViewport } from "@/lib/motion/use-near-viewport";

export function ClosingStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const near = useNearViewport(sectionRef);
  useLineRise(headingRef, { active: near });

  return (
    <section id="closing" ref={sectionRef} className="closing" aria-labelledby="closing-title">
      <div className="shell closing__content">
        <SectionLabel>THE ZARAVAN FAMILY</SectionLabel>
        <h2 ref={headingRef} id="closing-title" data-anim>From our field to your kitchen, <em>nothing in between.</em></h2>
        <button className="action-link action-link--secondary" type="button" onClick={() => dialogRef.current?.showModal()}><span>Read our story</span><span aria-hidden="true" className="action-link__arrow">↗</span></button>
      </div>
      <dialog ref={dialogRef} className="story-dialog" aria-labelledby="story-title">
        <div className="story-dialog__inner">
          <button className="product-dialog__close" type="button" aria-label="Close family story" onClick={() => dialogRef.current?.close()}>×</button>
          <SectionLabel>FROM KHORASAN</SectionLabel>
          <h3 id="story-title">Three harvests, one family.</h3>
          <p>In the highlands of Khorasan, the saffron crocus flowers for two weeks each autumn. It opens before dawn and closes by mid-morning, and in those few hours the entire year is decided. The flowers must be picked by hand while still closed, and the three crimson threads inside each one separated by hand the same day, before the colour begins to fade.</p>
          <p>Our grandfather planted his first corms on this land in 1961. He taught our father where the soil holds water and where it drains, which slopes catch the first light, and how to tell by the weight of a handful of threads whether they have been dried a minute too long. Our father taught us.</p>
          <p>For most of those sixty years our saffron left the farm in unmarked sacks. It was bought by brokers, blended with lesser harvests, repacked in other countries, and sold under other names. The people who cooked with it never knew where it came from. We never knew who they were.</p>
          <p>Zaravan exists to close that distance. Every jar we send carries the year it was harvested, the batch it came from, and the laboratory report that confirms what is inside it. Nothing is added. Nothing is blended. It goes from our field to your kitchen and nowhere else in between.</p>
          <p className="story-dialog__signature">— The Zaravan family, Khorasan</p>
        </div>
      </dialog>
    </section>
  );
}
