"use client";

import { useEffect, useState } from "react";

export function ParallaxBackground() {
  const [offset, setOffset] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        setOffset(window.scrollY);
        setProgress(distance > 0 ? (window.scrollY / distance) * 100 : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className="parallax-backdrop" aria-hidden="true">
      <i className="parallax-orbit parallax-orbit-one" style={{ transform: `translate3d(0, ${offset * -0.08}px, 0)` }} />
      <i className="parallax-orbit parallax-orbit-two" style={{ transform: `translate3d(0, ${offset * 0.05}px, 0)` }} />
      <i className="parallax-grid" style={{ transform: `translate3d(0, ${offset * -0.025}px, 0)` }} />
      <i className="scroll-progress" style={{ transform: `scaleY(${progress / 100})` }} />
    </div>
  );
}
