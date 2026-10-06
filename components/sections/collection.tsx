"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ProductDialog } from "@/components/ui/product-dialog";
import type { Product } from "@/lib/data/products";
import { collection, formatPerGram, formatPrice } from "@/lib/data/products";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useReveal } from "@/lib/motion/use-reveal";

// Two large tiles bookend the grid diagonally; the four smaller ones sit between them.
const ORDER = ["gift-box", "select", "heritage-bunch", "kitchen", "kitchen-large", "chef-trade"];
const LARGE = new Set(["gift-box", "chef-trade"]);
const tiles = ORDER.map((id) => collection.find((product) => product.id === id)).filter((product): product is Product => Boolean(product));

function Tile({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const large = LARGE.has(product.id);
  return (
    <article className={`tile${large ? " tile--large" : ""}`} data-reveal data-anim>
      <div className="tile__media">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes={large ? "(max-width: 767px) 100vw, 46vw" : "(max-width: 767px) 50vw, 23vw"}
          className="tile__image"
        />
      </div>
      <div className="tile__body">
        <div className="tile__row">
          <h3 className="tile__name">{product.name}</h3>
          <span className="tile__price">{formatPrice(product.price)}</span>
        </div>
        <div className="tile__row data">
          <span>{product.grade}, {product.weight}</span>
          <span>{product.pricePerGram === null ? "Gift set" : `${formatPerGram(product.pricePerGram)} / g`}</span>
        </div>
        {large && <p className="tile__description">{product.description}</p>}
      </div>
      <button className="tile__hit" type="button" aria-label={`${product.name}, ${product.weight}, details`} onClick={() => onOpen(product)} />
    </article>
  );
}

export function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  useLineRise(headingRef);
  useReveal(sectionRef);

  return (
    <section id="collection" ref={sectionRef} className="collection" aria-labelledby="collection-title">
      <div className="shell">
        <div className="collection__head">
          <h2 ref={headingRef} id="collection-title" className="display-l" data-anim>Every grade, <em>plainly priced.</em></h2>
          <p className="collection__intro">One origin. Every grade and size marked plainly, from a kitchen tin to the whole tied flower.</p>
        </div>
        <div className="collection__grid">
          {tiles.map((product) => <Tile key={product.id} product={product} onOpen={setDetail} />)}
        </div>
        <p className="collection__trade data">Trade accounts order 100 g to 1 kg, priced by quote.</p>
      </div>
      <ProductDialog product={detail} onClose={() => setDetail(null)} />
    </section>
  );
}
