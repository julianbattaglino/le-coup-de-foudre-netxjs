import BrandMark from "../brand-mark";

export default function FooterMain() {
  return (
    <footer className="site-footer site-footer--combined">
      <div className="site-footer__top">
        <BrandMark className="brand-mark" inverse />
        <p>Private journeys, gatherings and encounters across France.</p>
        <a className="text-link text-link--light" href="#top">Back to the beginning <span aria-hidden="true">↑</span></a>
      </div>
      <div className="site-footer__brand-copy">
        <p>Le Coup de Foudre<br /><em>Atelier de Maison Hospitalité · Paris</em></p>
        <p>Curated bespoke itineraries, crafted dinners and intimate French experiences for connoisseurs of culture and heritage.</p>
        <a href="mailto:contact@lecoupdefoudre-paris.com">contact@lecoupdefoudre-paris.com</a>
      </div>
      <div className="site-footer__directory">
        <div><span>Curated experiences</span><a href="#journeys">Private Journeys</a><a href="#journeys">Gatherings</a><a href="#journeys">Collective Journeys</a><a href="#experiences">The Maison</a></div>
        <div><span>Discover France</span><a href="#experiences">Paris</a><a href="#experiences">Provence</a><a href="#experiences">Loire Valley</a><a href="#experiences">Countryside</a></div>
        <div><span>Newsletter</span><p>Notes from Paris, places and people worth knowing.</p><a href="mailto:contact@lecoupdefoudre-paris.com">Join our letter ↗</a></div>
      </div>
      <div className="site-footer__bottom">
        <span>© Le Coup de Foudre Paris · All rights reserved</span>
        <span>Images via <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash</a>.</span>
        <span><a href="#top">Mentions légales</a>&nbsp; · &nbsp;<a href="#top">Confidentialité</a></span>
        <a href="mailto:contact@lecoupdefoudre-paris.com">Contact</a>
      </div>
      <p className="site-footer__wordmark" aria-hidden="true">Le Coup de Foudre</p>
    </footer>
  );
}
