"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { priceLadder, products } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import { useCarouselMotion } from "@/lib/motion/use-carousel-motion";
import { useCounterScrub } from "@/lib/motion/use-counter-scrub";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useMaskReveal } from "@/lib/motion/use-mask-reveal";
import { useNearViewport } from "@/lib/motion/use-near-viewport";

const formatPerGram = (value: number) => `$${value.toFixed(2)}`;
const formatPerGramWithUnit = (value: number) => `${formatPerGram(value)}/g`;

function ProductSlide({ product, index, active, near, onDetails }: {
  product: Product;
  index: number;
  active: boolean;
  near: boolean;
  onDetails: (product: Product) => void;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  useMaskReveal(imageRef, near);
  return (
    <article className="product-slide" data-product-slide data-active={active} aria-label={`${index + 1} of ${products.length}: ${product.name}`}>
      <div ref={imageRef} className="product-slide__image-wrap" data-anim>
        <span className="product-slide__glow" aria-hidden="true" />
        {/* Placeholder for Design.md §11: this SKU's 4:5 product shot on black with controlled rim light. */}
        <Image src={product.image} alt={`${product.name}, ${product.format}`} width={640} height={800} sizes="(max-width: 767px) calc(100vw - 48px), min(56vw, 720px)" className="product-slide__image" />
        <span data-mask-cover className="product-slide__cover" aria-hidden="true" />
      </div>
      <div className="product-slide__content">
        <span className="eyebrow product-slide__grade">{product.grade}</span>
        <h3 className="product-slide__name">{product.name}</h3>
        <p className="product-slide__description">{product.description}</p>
        <div className="product-slide__meta">
          <span>{product.weight} <span aria-hidden="true">·</span> {product.pricePerGram === null ? "GIFT SET" : `${formatPerGram(product.pricePerGram)}/g`}</span>
          <strong>${product.price}</strong>
        </div>
        <button className="action-link action-link--secondary product-slide__button" type="button" tabIndex={active ? 0 : -1} onClick={() => onDetails(product)}><span>View details</span><span aria-hidden="true" className="action-link__arrow">↗</span></button>
      </div>
    </article>
  );
}

function PriceLadderRow({ product, near }: { product: Product; near: boolean }) {
  const valueRef = useRef<HTMLSpanElement>(null);
  useCounterScrub(valueRef, { from: 14, to: product.pricePerGram ?? 14, format: formatPerGramWithUnit, active: near });
  return (
    <div className="price-ladder__row" role="row">
      <span role="cell">{product.weight}</span>
      <span role="cell">{product.name}</span>
      <span ref={valueRef} role="cell" className="price-ladder__value" data-anim>{formatPerGram(product.pricePerGram ?? 14)}/g</span>
    </div>
  );
}

export function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerStart = useRef<number | null>(null);
  const wheelAt = useRef(0);
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState<Product | null>(null);
  const near = useNearViewport(sectionRef);
  const enhanced = useCarouselMotion(viewportRef, trackRef, index, near);
  useLineRise(headingRef, { active: near });

  const move = useCallback((by: number) => setIndex((current) => Math.min(products.length - 1, Math.max(0, current + by))), []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !enhanced) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 5) return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheelAt.current < 450) return;
      wheelAt.current = now;
      move(event.deltaX > 0 ? 1 : -1);
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [enhanced, move]);

  useEffect(() => {
    if (detail) dialogRef.current?.showModal();
  }, [detail]);

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!enhanced || pointerStart.current === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1);
  };
  const onNativeScroll = () => {
    if (enhanced) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>("[data-product-slide]");
    if (!viewport || !track || !first) return;
    const step = first.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
    setIndex(Math.min(products.length - 1, Math.max(0, Math.round(viewport.scrollLeft / step))));
  };

  return (
    <section id="products" ref={sectionRef} className="products section-space" aria-labelledby="products-title">
      <div className="shell products__intro">
        <SectionLabel>THE HARVEST / 01—10</SectionLabel>
        <h2 ref={headingRef} id="products-title" className="section-heading" data-anim>From the field, <em>measured.</em></h2>
        <p className="section-intro">One origin. Every grade and size marked plainly, from the first vial to a working kitchen’s tin.</p>
      </div>
      <div className="products__carousel">
        <div ref={viewportRef} className={`products__viewport${enhanced ? " products__viewport--enhanced" : ""}`} role="region" aria-roledescription="carousel" aria-label="Zaravan products" tabIndex={0} onPointerDown={(event) => { if (enhanced && event.pointerType !== "touch") { pointerStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); } }} onPointerUp={onPointerUp} onPointerCancel={() => { pointerStart.current = null; }} onScroll={onNativeScroll} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
          <div ref={trackRef} className="products__track">
            {products.map((product, slideIndex) => <ProductSlide key={product.id} product={product} index={slideIndex} active={index === slideIndex} near={near} onDetails={setDetail} />)}
          </div>
        </div>
        <div className="products__controls shell">
          <span className="eyebrow products__count">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
          <div className="products__progress" aria-label={`Product ${index + 1} of ${products.length}`} role="progressbar" aria-valuemin={1} aria-valuemax={products.length} aria-valuenow={index + 1}><span style={{ transform: `scaleX(${(index + 1) / products.length})` }} /></div>
          <div className="products__arrows"><button type="button" aria-label="Previous product" disabled={index === 0} onClick={() => move(-1)}>←</button><button type="button" aria-label="Next product" disabled={index === products.length - 1} onClick={() => move(1)}>→</button></div>
        </div>
      </div>
      <div id="price-ladder" className="price-ladder shell" aria-labelledby="price-ladder-title">
        <div className="price-ladder__intro"><SectionLabel>PRICE / GRAM</SectionLabel><h3 id="price-ladder-title">A clear measure of value.</h3></div>
        <div className="price-ladder__table" role="table" aria-label="Signature price per gram by size">
          <div className="price-ladder__head" role="row"><span role="columnheader">WEIGHT</span><span role="columnheader">SIGNATURE</span><span role="columnheader">PRICE / G</span></div>
          {priceLadder.map((product) => <PriceLadderRow key={product.id} product={product} near={near} />)}
        </div>
      </div>
      <dialog ref={dialogRef} className="product-dialog" onClose={() => setDetail(null)} aria-label={detail?.name}>
        {detail && <div className="product-dialog__inner"><button className="product-dialog__close" type="button" aria-label="Close product details" onClick={() => dialogRef.current?.close()}>×</button><span className="eyebrow">{detail.grade}</span><h3>{detail.name}</h3><p>{detail.description}</p><dl><div><dt>Weight</dt><dd>{detail.weight}</dd></div><div><dt>Format</dt><dd>{detail.format}</dd></div><div><dt>Price per gram</dt><dd>{detail.pricePerGram === null ? "—" : formatPerGram(detail.pricePerGram)}</dd></div><div><dt>Price</dt><dd>${detail.price}</dd></div></dl><p className="product-dialog__note">Checkout is not connected in this homepage preview.</p></div>}
      </dialog>
    </section>
  );
}
