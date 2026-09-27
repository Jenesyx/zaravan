"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { useLineRise } from "@/lib/motion/use-line-rise";

const features = [
  {
    eyebrow: "01 / PURITY",
    title: "Measured before it leaves us.",
    body: "Every batch is tested to ISO 3632-2. Its crocin, picrocrocin, and safranal values travel with it.",
    data: "ISO 3632-2 · EACH BATCH",
  },
  {
    eyebrow: "02 / ORIGIN",
    title: "One family. One region.",
    body: "Our threads are grown and picked in Khorasan by the family behind Zaravan.",
    data: "KHORASAN, IRAN · EST. 1961",
  },
  {
    eyebrow: "03 / FRESHNESS",
    title: "Only the current harvest.",
    body: "We mark the harvest year and batch on every package, then seal the threads at source.",
    data: "2026 HARVEST · BATCH TRACED",
  },
  {
    eyebrow: "04 / DELIVERY",
    title: "Across the distance, quickly.",
    body: "Worldwide delivery is guaranteed in under seven days. Duties are paid for the EU, UK, US, and Canada.",
    data: "UNDER 7 DAYS · DUTIES PAID",
  },
];

function FeatureItem({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useLineRise(titleRef, { delay: index * 0.12 });
  return (
    <article className="feature-item">
      <span className="eyebrow feature-item__eyebrow">{feature.eyebrow}</span>
      <h3 ref={titleRef} className="feature-item__title" data-anim>{feature.title}</h3>
      <p>{feature.body}</p>
      <span className="data-text feature-item__data">{feature.data}</span>
    </article>
  );
}

export function Features() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headingRef);
  return (
    <section id="features" className="features section-space" aria-labelledby="features-title">
      <div className="shell">
        <div className="features__intro"><SectionLabel>WHAT WE OFFER</SectionLabel><h2 ref={headingRef} id="features-title" className="section-heading" data-anim>Trust is a matter of <em>detail.</em></h2></div>
        <div className="features__grid">{features.map((feature, index) => <FeatureItem key={feature.eyebrow} feature={feature} index={index} />)}</div>
      </div>
    </section>
  );
}
