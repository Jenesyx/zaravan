"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { testimonials } from "@/lib/data/testimonials";
import { useLineRise } from "@/lib/motion/use-line-rise";

export function Testimonials() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useLineRise(headingRef);

  // WAI-ARIA tabs: arrows move and select, Home/End jump to the ends.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = testimonials.length - 1;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const index = next < 0 ? last : next > last ? 0 : next;
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  return (
    <section id="testimonials" className="voices" aria-labelledby="testimonials-title">
      <div className="shell">
        <h2 ref={headingRef} id="testimonials-title" className="display-l" data-anim>The harvest, in <em>their words.</em></h2>

        <div className="voices__stage">
          {testimonials.map((item, index) => (
            <figure
              key={item.id}
              id={`voice-panel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`voice-tab-${item.id}`}
              className={`voice${index === active ? " is-active" : ""}`}
              inert={index !== active}
            >
              <blockquote className="voice__quote"><p>“{item.quote}”</p></blockquote>
              <figcaption className="voice__by"><span className="voice__name">{item.name}</span><span className="data">{item.place}</span></figcaption>
            </figure>
          ))}
        </div>

        <div className="voices__tabs" role="tablist" aria-label="Reviews" onKeyDown={onKeyDown}>
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`voice-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={index === active}
              aria-controls={`voice-panel-${item.id}`}
              tabIndex={index === active ? 0 : -1}
              className="voices__tab"
              onClick={() => setActive(index)}
            >
              <span className="voices__tab-name">{item.name}</span>
              <span className="voices__tab-place">{item.place}</span>
            </button>
          ))}
        </div>

        {/* Business.md §7.4: these are layout drafts and must be replaced before launch. */}
        <p className="voices__note">Draft reviews for layout only. Verified customer reviews replace them before launch.</p>
      </div>
    </section>
  );
}
