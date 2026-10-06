"use client";

import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useMagnetic } from "@/lib/motion/use-magnetic";

type ActionLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
};

export function ActionLink({ href, children, variant = "secondary", className = "" }: ActionLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, variant === "primary");
  return (
    <a ref={ref} href={href} className={`action-link action-link--${variant} ${className}`.trim()}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" className="action-link__icon" size={18} weight="regular" />
    </a>
  );
}
