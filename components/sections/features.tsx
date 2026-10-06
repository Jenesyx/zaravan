"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useReveal } from "@/lib/motion/use-reveal";

const standards = [
  {
    figure: "ISO 3632-2",
    title: "Measured before it leaves us.",
    body: "Every batch is tested to ISO 3632-2. Its crocin, picrocrocin, and safranal values travel with it.",
  },
  {
    figure: "1961",
    title: "One family. One region.",
    body: "Our threads are grown and picked in Khorasan by the family behind Zaravan, on land first planted in 1961.",
  },
  {
    figure: "2026",
    title: "Only the current harvest.",
    body: "We mark the harvest year and batch on every package, then seal the threads at source.",
  },
  {
    figure: "7 days",
    title: "Across the distance, quickly.",
    body: "Worldwide delivery in under seven days, or the shipping is refunded. Duties are paid for the EU, UK, US, and Canada.",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headingRef);
  useReveal(sectionRef);

  return (
    <section id="features" ref={sectionRef} className="standards" aria-labelledby="features-title">
      <div className="standards__grid shell">
        <div className="standards__text">
          <h2 ref={headingRef} id="features-title" className="display-l" data-anim>Trust is a matter of <em>detail.</em></h2>
          <ol className="standards__list">
            {standards.map((item) => (
              <li className="standard" key={item.figure} data-reveal data-anim>
                <p className="standard__figure">{item.figure}</p>
                <div>
                  <h3 className="standard__title">{item.title}</h3>
                  <p className="standard__body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="standards__media" aria-hidden="true">
          <Image src="/images/products/kitchen-large.png" alt="" fill sizes="(max-width: 1023px) 100vw, 38vw" className="standards__image" />
        </div>
      </div>
    </section>
  );
}
