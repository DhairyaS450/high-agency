"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 up to `to` once it scrolls into view. Lands exactly on the
 * target even if rAF is throttled (background tab).
 */
export default function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const dur = 1100;
      let start: number | null = null;
      const tick = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => setValue(to), dur + 250);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{value}</span>;
}
