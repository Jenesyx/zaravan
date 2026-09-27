"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useFooterMotion } from "@/lib/motion/use-footer-motion";

const columns = [
  { title: "Shop", links: [{ label: "The harvest", href: "#products" }, { label: "Price per gram", href: "#price-ladder" }] },
  { title: "Learn", links: [{ label: "Our standards", href: "#features" }, { label: "Our story", href: "#closing" }] },
  { title: "Trade", links: [{ label: "Chef / Trade", href: "#products" }, { label: "Delivery", href: "#features" }] },
  { title: "Contact", links: [{ label: "Harvest notes", href: "#newsletter" }, { label: "Back to top", href: "#top" }] },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [formMessage, setFormMessage] = useState("");
  useFooterMotion(footerRef, wordmarkRef);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("Harvest notes signup is not connected in this homepage preview.");
  };

  return (
    <footer id="footer" ref={footerRef} className="footer">
      <div className="shell">
        <div className="footer__top">
          <div id="newsletter" className="footer__newsletter">
            <span className="eyebrow">HARVEST NOTES</span>
            <p>Harvest notes, twice a year. Nothing else.</p>
            <form onSubmit={onSubmit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" name="email" placeholder="Your email address" required autoComplete="email" /><button type="submit" aria-label="Subscribe to harvest notes">→</button></form>
            <span className="footer__form-message" role="status">{formMessage}</span>
          </div>
          <nav className="footer__columns" aria-label="Footer">
            {columns.map((column) => <div className="footer__column" key={column.title}><h2 className="eyebrow">{column.title}</h2>{column.links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}</div>)}
          </nav>
        </div>
        <div className="footer__bottom eyebrow"><span>© {new Date().getFullYear()} ZARAVAN</span><span>KHORASAN, IRAN · EST. 1961</span><span>USD <span aria-hidden="true">/</span> PAYMENT METHODS PENDING</span></div>
      </div>
      {/* Placeholder wordmark for Design.md §11: final saffron-thread motif SVG. */}
      <div ref={wordmarkRef} className="footer__wordmark" aria-hidden="true">Zaravan</div>
    </footer>
  );
}
