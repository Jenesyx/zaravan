"use client";

import { useEffect, useRef, useState } from "react";
import { Handbag, List, X } from "@phosphor-icons/react";
import { useNavMotion } from "@/lib/motion/use-nav-motion";

const links = [
  { label: "Signature", href: "#products" },
  { label: "Collection", href: "#collection" },
  { label: "Standards", href: "#features" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Story", href: "#closing" },
];

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
    const onResize = () => { if (window.innerWidth >= 960) setMenuOpen(false); };
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
      <header ref={navRef} className={`site-nav${scrolled || menuOpen ? " site-nav--solid" : ""}`}>
        <div className="site-nav__inner shell">
          <a className="wordmark" href="#top" aria-label="Zaravan, back to top">Zaravan</a>
          <nav aria-label="Primary" className="site-nav__links">
            {links.map((link) => <a className="site-nav__link" href={link.href} key={link.href}>{link.label}</a>)}
          </nav>
          <div className="site-nav__actions">
            <span className="site-nav__currency" aria-label="Prices in United States dollars">USD</span>
            {/* Basket wiring lands with /build-basket; until then the button states that plainly. */}
            <button className="icon-button" type="button" disabled aria-label="Basket, opens at launch" title="Basket opens at launch">
              <Handbag aria-hidden="true" size={20} />
            </button>
            <button
              ref={toggleRef}
              className="icon-button site-nav__toggle"
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X aria-hidden="true" size={20} /> : <List aria-hidden="true" size={20} />}
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav aria-label="Mobile" className="mobile-menu__content shell">
          {links.map((link) => <a className="mobile-menu__link" href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
        </nav>
      </div>
    </>
  );
}
