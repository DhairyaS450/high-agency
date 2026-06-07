"use client";

import { useEffect, useRef, useState } from "react";

const CITIES = [
  "London", "Lagos", "Singapore", "Austin", "Berlin", "Toronto",
  "Mumbai", "São Paulo", "Seoul", "Nairobi", "Dubai", "Boston",
  "Amsterdam", "Jakarta", "Tel Aviv", "Bangalore", "Sydney",
];
const VERBS = [
  "just requested access", "started an application", "joined the queue",
  "is founding a Unit", "requested access",
];

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

export default function Ticker() {
  const [text, setText] = useState("Operator from London just requested access");
  const [visible, setVisible] = useState(true);
  const feedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const t = setTimeout(() => {
        setText(`Operator from ${pick(CITIES)} ${pick(VERBS)}`);
        setVisible(true);
      }, 350);
      return () => clearTimeout(t);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker">
      <span className="arrow">▸</span>
      <span ref={feedRef} className="ticker__feed" style={{ opacity: visible ? 1 : 0 }}>
        {text}
      </span>
    </div>
  );
}
