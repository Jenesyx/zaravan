"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ProductDialog } from "@/components/ui/product-dialog";
import type { Product } from "@/lib/data/products";
import { formatPerGram, signatureLine } from "@/lib/data/products";
import { useLineRise } from "@/lib/motion/use-line-rise";
import { useMaskReveal } from "@/lib/motion/use-mask-reveal";
import { useNumberTween } from "@/lib/motion/use-number-tween";

const DEFAULT_ID = "signature-standard"; // Business.md §3.2: the vial converts to the 5 g and 10 g jars.
const formatWholePrice = (value: number) => `$${Math.round(value)}`;
const formatGram = (value: number) => `${formatPerGram(value)} per gram`;

export function Signature() {
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const perGramRef = useRef<HTMLSpanElement>(null);
  const [activeId, setActiveId] = useState(DEFAULT_ID);
  const [detail, setDetail] = useState<Product | null>(null);
  const [status, setStatus] = useState("");
  const active = signatureLine.find((product) => product.id === activeId) ?? signatureLine[0];

  useLineRise(headingRef);
  useMaskReveal(stageRef);
  useNumberTween(priceRef, active.price, formatWholePrice);
  useNumberTween(perGramRef, active.pricePerGram ?? 0, formatGram);

  return (
    <section id="products" className="signature" aria-labelledby="signature-title">
      <div className="signature__grid shell">
        <div ref={stageRef} className="signature__stage" data-anim>
          {signatureLine.map((product, index) => (
            <Image
              key={product.id}
              src={product.image}
              alt={product.id === active.id ? product.alt : ""}
              aria-hidden={product.id !== active.id || undefined}
              fill
              sizes="(max-width: 1023px) 100vw, 56vw"
              loading={index === 0 || product.id === DEFAULT_ID ? "eager" : "lazy"}
              className={`signature__image${product.id === active.id ? " is-active" : ""}`}
            />
          ))}
          <span data-mask-cover className="mask-cover" aria-hidden="true" />
        </div>

        <div className="signature__panel">
          <p className="label">Super Negin</p>
          <h2 ref={headingRef} id="signature-title" className="display-l" data-anim>Zaravan <em>Signature</em></h2>
          <p className="signature__intro">Our longest all-red threads, the top three to five percent of each harvest, in four sizes.</p>

          <fieldset id="price-ladder" className="size-picker">
            <legend className="label">Size</legend>
            <div className="size-picker__options">
              {signatureLine.map((product) => (
                <label key={product.id} className="size-option">
                  <input
                    className="size-option__input"
                    type="radio"
                    name="signature-size"
                    value={product.id}
                    checked={product.id === active.id}
                    onChange={() => { setActiveId(product.id); setStatus(""); }}
                  />
                  <span className="size-option__weight">{product.weight}</span>
                  <span className="size-option__per">{product.pricePerGram === null ? "" : `${formatPerGram(product.pricePerGram)} / g`}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="signature__price">
            <span ref={priceRef} className="signature__amount">{formatWholePrice(active.price)}</span>
            <span ref={perGramRef} className="data">{formatGram(active.pricePerGram ?? 0)}</span>
          </div>
          <p className="signature__format data">{active.format}</p>
          <p className="signature__description">{active.description}</p>

          <div className="signature__actions">
            <button className="action-link action-link--primary" type="button" onClick={() => setStatus("The basket opens at launch.")}>
              <span>Add to basket</span>
            </button>
            <button className="action-link action-link--secondary" type="button" onClick={() => setDetail(active)}>
              <span>Details</span><ArrowUpRight aria-hidden="true" className="action-link__icon" size={18} />
            </button>
          </div>
          <p className="signature__status data" role="status">{status}</p>
        </div>
      </div>
      <ProductDialog product={detail} onClose={() => setDetail(null)} />
    </section>
  );
}
