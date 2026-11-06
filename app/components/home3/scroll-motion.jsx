"use client";

import { useEffect, useRef } from "react";
import AOS from "aos";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollMotion({ children, className = "home3" }) {
  const root = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    AOS.init({ duration: 760, easing: "ease-out-cubic", once: true, offset: 70, disable: reducedMotion });

    if (reducedMotion) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      root.current?.querySelectorAll("h1, h2").forEach((title, index) => {
        gsap.fromTo(title, { x: index % 2 === 0 ? 44 : -44 }, {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: title,
            start: "top 92%",
            end: "top 56%",
            scrub: 0.7,
          },
        });
      });
    }, root);

    AOS.refreshHard();
    return () => context.revert();
  }, []);

  return <div className={className} ref={root}>{children}</div>;
}
