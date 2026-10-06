"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import type { Product } from "@/lib/data/products";
import { formatPerGram, formatPrice } from "@/lib/data/products";

/** Product details in a native modal dialog. Focus returns to the opener on close. */
export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (product && dialog && !dialog.open) dialog.showModal();
  }, [product]);

  return (
    <dialog ref={dialogRef} className="product-dialog" onClose={onClose} aria-labelledby="product-dialog-title" data-lenis-prevent>
      {product && (
        <div className="product-dialog__grid">
          <div className="product-dialog__media">
            <Image src={product.image} alt={product.alt} fill sizes="(max-width: 767px) 100vw, 540px" className="product-dialog__image" />
          </div>
          <div className="product-dialog__body">
            <button className="icon-button product-dialog__close" type="button" aria-label="Close details" onClick={() => dialogRef.current?.close()}>
              <X aria-hidden="true" size={20} />
            </button>
            <p className="label">{product.grade}</p>
            <h2 id="product-dialog-title" className="product-dialog__title">{product.name}</h2>
            <p className="product-dialog__description">{product.description}</p>
            <dl className="spec">
              <div><dt>Weight</dt><dd>{product.weight}</dd></div>
              <div><dt>Format</dt><dd>{product.format}</dd></div>
              <div><dt>Per gram</dt><dd>{product.pricePerGram === null ? "Gift set" : formatPerGram(product.pricePerGram)}</dd></div>
              <div><dt>Price</dt><dd>{formatPrice(product.price)}</dd></div>
            </dl>
            <p className="product-dialog__note">Ordering opens at launch. Duties are included for the EU, UK, US and Canada.</p>
          </div>
        </div>
      )}
    </dialog>
  );
}
