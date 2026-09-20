"use client";

import { useEffect, useState } from "react";

export function ParallaxBackground() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => setOffset(window.scrollY);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="parallax-backdrop" aria-hidden="true">
      <i className="parallax-orbit parallax-orbit-one" style={{ transform: `translate3d(0, ${offset * -0.08}px, 0)` }} />
      <i className="parallax-orbit parallax-orbit-two" style={{ transform: `translate3d(0, ${offset * 0.05}px, 0)` }} />
      <i className="parallax-grid" style={{ transform: `translate3d(0, ${offset * -0.025}px, 0)` }} />
    </div>
  );
}
