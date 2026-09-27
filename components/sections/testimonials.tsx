"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { testimonials } from "@/lib/data/testimonials";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useTestimonialDrift } from "@/lib/motion/use-testimonial-drift";

const columns = [[testimonials[0], testimonials[3]], [testimonials[1]], [testimonials[2], testimonials[4]]];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headingRef);
  useTestimonialDrift(sectionRef);
  return (
    <section id="testimonials" ref={sectionRef} className="testimonials section-space" aria-labelledby="testimonials-title">
      <div className="shell testimonials__intro"><SectionLabel>AT THE TABLE</SectionLabel><h2 ref={headingRef} id="testimonials-title" className="section-heading" data-anim>The harvest, in their words.</h2><p className="testimonials__draft eyebrow">DRAFT COPY FOR LAYOUT REVIEW · REPLACE WITH VERIFIED REVIEWS BEFORE LAUNCH</p></div>
      <div className="testimonials__window shell">
        <div className="testimonials__grid">
          {columns.map((column, columnIndex) => <div className="testimonials__column" data-drift-column key={columnIndex}>
            {column.map((item) => <blockquote className="quote-card" key={item.attribution}><p>“{item.quote}”</p><footer className="eyebrow">{item.attribution}</footer></blockquote>)}
          </div>)}
        </div>
      </div>
    </section>
  );
}
