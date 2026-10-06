"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { useFooterMotion } from "@/lib/motion/use-footer-motion";

const columns = [
  { title: "Shop", links: [{ label: "Signature", href: "#products" }, { label: "Collection", href: "#collection" }, { label: "Price per gram", href: "#price-ladder" }] },
  { title: "Learn", links: [{ label: "Our standards", href: "#features" }, { label: "Reviews", href: "#testimonials" }, { label: "Our story", href: "#closing" }] },
  { title: "Help", links: [{ label: "Delivery and duties", href: "#features" }, { label: "Back to top", href: "#top" }] },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [formMessage, setFormMessage] = useState("");
  useFooterMotion(footerRef, wordmarkRef);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("Harvest notes sign-up opens at launch.");
  };

  return (
    <footer id="footer" ref={footerRef} className="footer">
      <div className="shell">
        <div className="footer__top">
          <div id="newsletter" className="footer__newsletter">
            <h2 className="footer__heading">Harvest notes, <em>twice a year.</em></h2>
            <p className="footer__lede">The new harvest, its lab values, and how to use it. Nothing else.</p>
            <form className="field" onSubmit={onSubmit}>
              <label className="field__label" htmlFor="newsletter-email">Email address</label>
              <div className="field__row">
                <input className="field__input" id="newsletter-email" type="email" name="email" required autoComplete="email" aria-describedby="newsletter-message" />
                <button className="action-link action-link--secondary field__submit" type="submit">
                  <span>Subscribe</span><ArrowRight aria-hidden="true" className="action-link__icon" size={18} />
                </button>
              </div>
              <p id="newsletter-message" className="field__message" role="status">{formMessage}</p>
            </form>
          </div>
          <nav className="footer__columns" aria-label="Footer">
            {columns.map((column) => (
              <div className="footer__column" key={column.title}>
                <h2 className="label">{column.title}</h2>
                {column.links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
              </div>
            ))}
          </nav>
        </div>
        <div className="footer__bottom data">
          <span>© {new Date().getFullYear()} Zaravan</span>
          <span>Prices in USD. Duties included for the EU, UK, US and Canada.</span>
        </div>
      </div>
      <div ref={wordmarkRef} className="footer__wordmark" aria-hidden="true">Zaravan</div>
    </footer>
  );
}
