"use client";

import { useEffect, useState } from "react";
import BrandMark from "./brand-mark";

const menuItems = [
  { number: "01", title: "Nos expériences", detail: "Des rencontres et des savoir-faire confidentiels", href: "#experiences" },
  { number: "02", title: "Inspirations", detail: "Paris, les régions et leurs belles adresses", href: "#maison" },
  { number: "03", title: "Voyages privés", detail: "Des itinéraires dessinés autour de vous", href: "#pillars" },
  { number: "04", title: "La maison", detail: "Une hospitalité singulière, depuis Paris", href: "#maison" },
];

export default function FullScreenHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("menu-is-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("menu-is-open");
    };
  }, [isOpen]);

  return (
    <>
      <header className="fullscreen-header">
        <BrandMark className="fullscreen-header__brand" />
        <button className="fullscreen-header__trigger" type="button" aria-expanded={isOpen} aria-controls="fullscreen-navigation" onClick={() => setIsOpen((open) => !open)}>
          <span>{isOpen ? "Fermer" : "Menu"}</span><span className="fullscreen-header__icon" aria-hidden="true">{isOpen ? "×" : "☰"}</span>
        </button>
      </header>
      {isOpen && (
        <div className="fullscreen-menu" id="fullscreen-navigation" role="dialog" aria-modal="true" aria-label="Navigation principale">
          <div className="fullscreen-menu__top"><span>Le Coup de Foudre · Paris</span><button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer le menu">×</button></div>
          <div className="fullscreen-menu__content">
            <nav className="fullscreen-menu__links" aria-label="Main navigation">
              {menuItems.map((item) => <a key={item.number} href={item.href} onClick={() => setIsOpen(false)}><span>{item.number}</span><strong>{item.title}</strong><small>{item.detail}</small></a>)}
            </nav>
            <aside className="fullscreen-menu__aside">
              <span className="fullscreen-menu__eyebrow">Votre prochain voyage</span>
              <h2>La France, à votre façon.</h2>
              <p>Parlons des lieux, des rencontres et des instants que vous souhaitez découvrir.</p>
              <a className="fullscreen-menu__contact" href="#journey-request" onClick={() => setIsOpen(false)}>Contacter notre concierge <span aria-hidden="true">↗</span></a>
            </aside>
          </div>
          <div className="fullscreen-menu__bottom"><span>Paris · France</span><a href="mailto:contact@lecoupdefoudre-paris.com">contact@lecoupdefoudre-paris.com</a></div>
        </div>
      )}
    </>
  );
}
