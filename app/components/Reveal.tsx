"use client";

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

interface RevealProps {
  as?: ElementType;
  /** Stagger delay bucket (1–3), maps to CSS .reveal.in[data-d]. */
  d?: 1 | 2 | 3;
  className?: string;
  children?: ReactNode;
  // Allow arbitrary element props (style, id, aria-*, etc.)
  [key: string]: unknown;
}

/**
 * Scroll-reveal wrapper. Content is always visible (CSS keeps opacity 1);
 * intersecting only adds the `.in` class to animate the entrance, so a
 * no-JS / throttled render still shows everything.
 */
export default function Reveal({
  as: Tag = "div",
  d,
  className = "",
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    // Safety net: never leave it un-animated for long.
    const t = setTimeout(() => el.classList.add("in"), 2500);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} data-d={d} {...rest}>
      {children}
    </Tag>
  );
}
