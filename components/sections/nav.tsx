"use client";

import { useEffect, useRef, useState } from "react";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useNavMotion } from "@/lib/motion/use-nav-motion";

const links = [
  { label: "Shop", href: "#products" },
  { label: "Our promise", href: "#features" },
  { label: "Voices", href: "#testimonials" },
];

function MobileMenuLink({ label, href, open, onClick, delay }: {
  label: string;
  href: string;
  open: boolean;
  onClick: () => void;
  delay: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  useLineRise(textRef, { active: open, delay });
  return <a className="mobile-menu__link" href={href} onClick={onClick}><span ref={textRef} data-anim>{label}</span><span aria-hidden="true">↗</span></a>;
}

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useNavMotion(navRef, menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    const toggle = toggleRef.current;
    const main = document.getElementById("main-content");
    const footer = document.getElementById("footer");
    const mainWasInert = main?.inert ?? false;
    const footerWasInert = footer?.inert ?? false;
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    const menuLinks = [...document.querySelectorAll<HTMLAnchorElement>("#mobile-menu a")];
    menuLinks[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab" && menuLinks.length) {
        const first = toggle;
        const last = menuLinks[menuLinks.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = original;
      if (main) main.inert = mainWasInert;
      if (footer) footer.inert = footerWasInert;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      toggle?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header ref={navRef} className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner shell">
          {/* Placeholder wordmark for Design.md §11: final SVG with single saffron-thread motif. */}
          <a className="wordmark" href="#top" aria-label="Zaravan, back to top">Zaravan<span aria-hidden="true">.</span></a>
          <nav aria-label="Primary" className="site-nav__links">
            {links.map((link) => <a className="nav-roll" href={link.href} key={link.href}><span><span>{link.label}</span><span aria-hidden="true">{link.label}</span></span></a>)}
          </nav>
          <div className="site-nav__actions">
            <span className="currency-label" aria-label="Prices in United States dollars">USD</span>
            <button className="cart-button" type="button" disabled aria-label="Cart unavailable in this homepage preview" title="Cart unavailable in this homepage preview">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 4h2l2.2 10.5h11.6L21 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="18" cy="19" r="1" fill="currentColor"/></svg>
            </button>
            <button ref={toggleRef} className={`menu-toggle${menuOpen ? " menu-toggle--open" : ""}`} type="button" aria-controls="mobile-menu" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((value) => !value)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu__circle" aria-hidden="true" />
        <nav aria-label="Mobile" className="mobile-menu__content">
          <span className="eyebrow">EXPLORE ZARAVAN</span>
          {links.map((link, index) => <MobileMenuLink key={link.href} {...link} open={menuOpen} onClick={() => setMenuOpen(false)} delay={index * 0.12} />)}
          <span className="mobile-menu__foot eyebrow">KHORASAN, IRAN · EST. 1961</span>
        </nav>
      </div>
    </>
  );
}
