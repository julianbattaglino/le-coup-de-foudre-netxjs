"use client";

import { useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function FoilCard({ children, className = "" }) {
  const card = useRef(null);

  const setPosition = (clientX, clientY) => {
    const element = card.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const sx = clamp((clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2), -1, 1);
    const sy = clamp((clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2), -1, 1);
    const mxf = clamp((clientX - rect.left) / rect.width, 0, 1);
    element.style.setProperty("--foil-rx", `${-9 * sy}deg`);
    element.style.setProperty("--foil-ry", `${13 * sx}deg`);
    element.style.setProperty("--foil-x", `${mxf * 100}%`);
    element.style.setProperty("--foil-hover", "1");
  };

  const reset = () => {
    const element = card.current;
    if (!element) return;
    element.style.setProperty("--foil-rx", "0deg");
    element.style.setProperty("--foil-ry", "0deg");
    element.style.setProperty("--foil-x", "50%");
    element.style.setProperty("--foil-hover", "0");
  };

  const onKeyDown = (event) => {
    const element = card.current;
    if (!element) return;
    const key = event.key;
    if (["Home", "Escape"].includes(key)) { event.preventDefault(); reset(); return; }
    const moves = { ArrowUp: ["--foil-rx", 2.25], ArrowDown: ["--foil-rx", -2.25], ArrowLeft: ["--foil-ry", -3.25], ArrowRight: ["--foil-ry", 3.25] };
    if (!moves[key]) return;
    event.preventDefault();
    const [property, delta] = moves[key];
    const current = Number.parseFloat(element.style.getPropertyValue(property)) || 0;
    element.style.setProperty(property, `${clamp(current + delta, -13, 13)}deg`);
    element.style.setProperty("--foil-hover", "1");
  };

  return (
    <div className={`foil-card ${className}`} ref={card} onPointerMove={(event) => setPosition(event.clientX, event.clientY)} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset} onKeyDown={onKeyDown} tabIndex={0} role="group" aria-label="Interactive feature card. Move your pointer or use arrow keys to reveal the foil finish.">
      <div className="foil-card__face">{children}<span className="foil-card__sheen" aria-hidden="true" /><span className="foil-card__colour" aria-hidden="true" /></div>
    </div>
  );
}
