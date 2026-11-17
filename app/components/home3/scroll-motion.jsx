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
      root.current?.querySelectorAll("h1, h2").forEach((title) => {
        gsap.fromTo(title, { autoAlpha: 0, y: 16, filter: "blur(3px)" }, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.48,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, root);

    AOS.refreshHard();
    return () => context.revert();
  }, []);

  return <div className={className} ref={root}>{children}</div>;
}
