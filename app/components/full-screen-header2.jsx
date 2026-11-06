"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandMark from "./brand-mark";
import destinationsData from "../../data/destinations.json";

const destinationsByCountry = destinationsData.destinations.reduce((groups, destination) => {
  groups[destination.country] ??= [];
  groups[destination.country].push(destination);
  return groups;
}, {});

export default function HeaderFullScreen2() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const closeMenu = () => setIsOpen(false);
  const homeAnchor = (id) => `/#${id}`;
  const primaryLinks = [
    ["Experiences", homeAnchor("experiences")],
    ["Maison", homeAnchor("maison")],
    ["Estudio", homeAnchor("maison")],
  ];

  return (
    <header className={`fullscreen-header2${isScrolled ? " is-scrolled" : ""}`}>
      <div className="fullscreen-header2__bar">
        <div className="fullscreen-header2__brand-lockup">
          <Image className="fullscreen-header2__brand-seal" src="/images/logo-black.png" alt="Le Coup de Foudre seal" width={48} height={48} priority />
          <BrandMark className="fullscreen-header2__wordmark" />
        </div>
        <button className="fullscreen-header2__trigger" type="button" aria-expanded={isOpen} aria-controls="fullscreen-navigation2" onClick={() => setIsOpen((open) => !open)}>
          <span>{isOpen ? "Close" : "Menu"}</span><span className="fullscreen-header2__icon" aria-hidden="true">{isOpen ? "×" : "☰"}</span>
        </button>
      </div>
      {isOpen && (
        <>
        <button className="fullscreen-menu2__backdrop" type="button" aria-label="Close menu" onClick={closeMenu} />
        <div className="fullscreen-menu2" id="fullscreen-navigation2" role="dialog" aria-modal="true" aria-label="Main navigation">
           {/*<div className="fullscreen-menu2__top">
           <div className="fullscreen-menu2__seal" aria-label="Logo placeholder">
              <Image src="/images/logo-black.png" alt="Logo placeholder — replace with Le Coup de Foudre seal" width={72} height={72} priority />
            </div> 
            <button type="button" onClick={closeMenu} aria-label="Close menu">×</button>
          </div>
          */}
          <div className="fullscreen-menu2__content">
            <nav className="fullscreen-menu2__nav" aria-label="Main navigation">
              <details className="fullscreen-menu2__where" open>
                <summary>Where to Go <span aria-hidden="true">＋</span></summary>
                <div className="fullscreen-menu2__countries">
                  {Object.entries(destinationsByCountry).map(([country, places]) => (
                    <details className="fullscreen-menu2__country" key={country}>
                      <summary>{country}<span aria-hidden="true">＋</span></summary>
                      <ul>{places.map((place) => <li key={place.slug}><Link href={`/destinations/${place.countrySlug}/${place.slug}`} onClick={closeMenu}>{place.title}</Link></li>)}</ul>
                    </details>
                  ))}
                </div>
                <Link className="fullscreen-menu2__all-destinations" href="/destinations" onClick={closeMenu}>
                  All destinations <span aria-hidden="true">↗</span>
                </Link>
              </details>
              <div className="fullscreen-menu2__primary">
                {primaryLinks.map(([label, href]) => <a href={href} key={label} onClick={closeMenu}>{label}</a>)}
              </div>
              <div className="fullscreen-menu2__secondary">
                <a href={homeAnchor("maison")} onClick={closeMenu}>About Us</a>
                <a href={homeAnchor("journey-request")} onClick={closeMenu}>Contact Us</a>
                <a href="mailto:contact@lecoupdefoudre-paris.com?subject=Newsletter" onClick={closeMenu}>Newsletter</a>
              </div>
            </nav>
            <aside className="fullscreen-menu2__contact">
              <span className="fullscreen-menu2__eyebrow">Get in touch</span>
              <address>
                <span>Pont Alexandre III, 75007 Paris</span>
                <a href="mailto:contact@lecoupdefoudre-paris.com">contact@lecoupdefoudre-paris.com</a>
                <a href="tel:+33660612882">+33 6 60 61 28 82</a>
              </address>
            </aside>
          </div>
          <div className="fullscreen-menu2__bottom"><span>Paris · France</span><a href="mailto:contact@lecoupdefoudre-paris.com">Contact the Maison <span aria-hidden="true">↗</span></a></div>
        </div>
        </>
      )}
    </header>
  );
}
