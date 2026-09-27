import type { ReactNode } from "react";

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`section-label ${className}`.trim()}><span aria-hidden="true" className="section-label__rule" />{children}</span>;
}
